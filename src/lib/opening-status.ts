import {
  openingHours,
  studioTimeZone,
  weekdays,
  type HoursException,
  type Interval,
  type OpeningHours,
  type Weekday,
} from "@/config/opening-hours";

const weekdayFromShort: Record<string, Weekday> = {
  Sun: "sunday",
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
};

const searchDays = 21;

export type RomeClock = {
  isoDate: string;
  weekday: Weekday;
  minutes: number;
};

export type NextOpening = {
  isoDate: string;
  weekday: Weekday;
  time: string;
  relation: "today" | "tomorrow" | "later";
};

export type OpeningStatus =
  | { kind: "open"; until: string }
  | { kind: "break"; until: string }
  | { kind: "closed"; reason: "now" | "day"; next: NextOpening | null };

export function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function addDays(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${nextMonth}-${nextDay}`;
}

export function weekdayFromIso(isoDate: string): Weekday {
  const [year, month, day] = isoDate.split("-").map(Number);
  return weekdays[(new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7];
}

export function romeClock(now: Date): RomeClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: studioTimeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(now);

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(value("hour"));
  if (hour === 24) hour = 0;
  const minute = Number(value("minute"));
  const weekday = weekdayFromShort[value("weekday")];
  if (!weekday) throw new Error(`Unexpected weekday: ${value("weekday")}`);

  return {
    isoDate: `${value("year")}-${value("month")}-${value("day")}`,
    weekday,
    minutes: hour * 60 + minute,
  };
}

/**
 * Converts a Rome civil time to a UTC timestamp.
 * The guess is corrected by the offset Intl reports for that instant,
 * so summer and winter time both resolve without a fixed +1/+2.
 */
export function romeTimeToUtc(isoDate: string, time: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: studioTimeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(guess));
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  let zonedHour = value("hour");
  if (zonedHour === 24) zonedHour = 0;
  const zoned = Date.UTC(value("year"), value("month") - 1, value("day"), zonedHour, value("minute"), value("second"));
  return guess - (zoned - guess);
}

function exceptionFor(isoDate: string, exceptions: readonly HoursException[]) {
  return exceptions.find((item) => item.date === isoDate);
}

export function intervalsOn(isoDate: string, config: OpeningHours): readonly Interval[] {
  const exception = exceptionFor(isoDate, config.exceptions);
  const intervals = exception ? exception.intervals : config.weekly[weekdayFromIso(isoDate)];
  return intervals.filter(([start, end]) => toMinutes(end) > toMinutes(start));
}

function nextOpening(fromIso: string, startDayOffset: number, config: OpeningHours): NextOpening | null {
  for (let offset = startDayOffset; offset <= searchDays; offset += 1) {
    const isoDate = addDays(fromIso, offset);
    const intervals = intervalsOn(isoDate, config);
    if (intervals.length === 0) continue;
    return {
      isoDate,
      weekday: weekdayFromIso(isoDate),
      time: intervals[0][0],
      relation: offset === 0 ? "today" : offset === 1 ? "tomorrow" : "later",
    };
  }
  return null;
}

export function openingStatus(now: Date, config: OpeningHours = openingHours): OpeningStatus {
  const clock = romeClock(now);
  const intervals = intervalsOn(clock.isoDate, config);
  const current = intervals.find(
    ([start, end]) => clock.minutes >= toMinutes(start) && clock.minutes < toMinutes(end),
  );

  if (current) return { kind: "open", until: current[1] };

  const later = intervals.find(([start]) => toMinutes(start) > clock.minutes);
  const finishedOne = intervals.some(([, end]) => toMinutes(end) <= clock.minutes);

  if (later && finishedOne) return { kind: "break", until: later[0] };

  if (later) {
    return {
      kind: "closed",
      reason: "now",
      next: {
        isoDate: clock.isoDate,
        weekday: clock.weekday,
        time: later[0],
        relation: "today",
      },
    };
  }

  return {
    kind: "closed",
    reason: intervals.length === 0 ? "day" : "now",
    next: nextOpening(clock.isoDate, 1, config),
  };
}

export function msUntilNextChange(now: Date, config: OpeningHours = openingHours) {
  const clock = romeClock(now);
  const status = openingStatus(now, config);
  const candidates = [romeTimeToUtc(addDays(clock.isoDate, 1), "00:00") - now.getTime()];

  if (status.kind === "open" || status.kind === "break") {
    candidates.push(romeTimeToUtc(clock.isoDate, status.until) - now.getTime());
  } else if (status.next) {
    candidates.push(romeTimeToUtc(status.next.isoDate, status.next.time) - now.getTime());
  }

  const upcoming = candidates.filter((value) => value > 0);
  if (upcoming.length === 0) return null;
  return Math.min(...upcoming);
}

export function formatTime(time: string, locale: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat(locale, {
    hour: locale.startsWith("en") ? "numeric" : "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hourCycle: locale.startsWith("en") ? "h12" : "h23",
  }).format(new Date(Date.UTC(2026, 0, 5, hour, minute)));
}

const schemaDay: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function openingHoursSpecification(config: OpeningHours = openingHours) {
  return weekdays.flatMap((day) =>
    config.weekly[day].map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: schemaDay[day],
      opens,
      closes,
    })),
  );
}
