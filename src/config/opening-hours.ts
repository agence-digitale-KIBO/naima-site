/**
 * Opening hours for Naima Studio di Bellezza.
 *
 * These hours are FICTITIOUS. They exist so the banner and the hours
 * section can be built and tested. Naima must confirm them before they
 * are presented as real. While `confirmed` is false, the public copy
 * marks them as a draft and the site does not publish openingHours
 * structured data.
 *
 * Timezone is always Europe/Rome, including daylight-saving changes.
 * An empty day is closed. An exception replaces that date entirely:
 * an empty `intervals` list is an exceptional closure.
 */

export const studioTimeZone = "Europe/Rome";

export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof weekdays)[number];

/** Inclusive start, exclusive end, in 24-hour "HH:MM". */
export type Interval = readonly [start: string, end: string];

export type HoursException = {
  /** Calendar date in Europe/Rome, "YYYY-MM-DD". */
  date: string;
  intervals: readonly Interval[];
};

export type OpeningHours = {
  confirmed: boolean;
  weekly: Record<Weekday, readonly Interval[]>;
  exceptions: readonly HoursException[];
};

export const openingHours: OpeningHours = {
  confirmed: false,
  weekly: {
    monday: [],
    tuesday: [
      ["09:00", "12:30"],
      ["14:00", "19:00"],
    ],
    wednesday: [
      ["09:00", "12:30"],
      ["14:00", "19:00"],
    ],
    thursday: [
      ["09:00", "12:30"],
      ["14:00", "19:00"],
    ],
    friday: [
      ["09:00", "12:30"],
      ["14:00", "19:00"],
    ],
    saturday: [["09:00", "17:00"]],
    sunday: [],
  },
  exceptions: [],
};
