import assert from "node:assert/strict";
import test from "node:test";
import { openingHours, type OpeningHours } from "../config/opening-hours";
import { beautySalonSchema } from "./schema";
import {
  formatTime,
  msUntilNextChange,
  openingStatus,
  romeClock,
  romeTimeToUtc,
} from "./opening-status";

const closedWeek: OpeningHours = {
  confirmed: false,
  weekly: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  exceptions: [],
};

test("09:00 Rome in winter is open, and the minute before is not", () => {
  const open = openingStatus(new Date("2026-01-13T08:00:00.000Z"));
  assert.deepEqual(open, { kind: "open", until: "12:30" });

  const before = openingStatus(new Date("2026-01-13T07:59:00.000Z"));
  assert.equal(before.kind, "closed");
  if (before.kind !== "closed") return;
  assert.equal(before.reason, "now");
  assert.equal(before.next?.relation, "today");
  assert.equal(before.next?.time, "09:00");
});

test("the morning close is a break, and 14:00 reopens until 19:00", () => {
  const lunch = openingStatus(new Date("2026-01-13T11:30:00.000Z"));
  assert.deepEqual(lunch, { kind: "break", until: "14:00" });

  const afternoon = openingStatus(new Date("2026-01-13T13:00:00.000Z"));
  assert.deepEqual(afternoon, { kind: "open", until: "19:00" });
});

test("19:00 Rome is closed and the next opening is tomorrow", () => {
  const closed = openingStatus(new Date("2026-01-13T18:00:00.000Z"));
  assert.equal(closed.kind, "closed");
  if (closed.kind !== "closed") return;
  assert.equal(closed.reason, "now");
  assert.equal(closed.next?.relation, "tomorrow");
  assert.equal(closed.next?.isoDate, "2026-01-14");
  assert.equal(closed.next?.time, "09:00");
});

test("a weekly closure names the real next opening, skipping Sunday", () => {
  const monday = openingStatus(new Date("2026-01-12T10:00:00.000Z"));
  assert.equal(monday.kind, "closed");
  if (monday.kind !== "closed") return;
  assert.equal(monday.reason, "day");
  assert.equal(monday.next?.weekday, "tuesday");
  assert.equal(monday.next?.time, "09:00");

  const saturdayClose = openingStatus(new Date("2026-01-17T16:00:00.000Z"));
  assert.equal(saturdayClose.kind, "closed");
  if (saturdayClose.kind !== "closed") return;
  assert.equal(saturdayClose.reason, "now");
  assert.equal(saturdayClose.next?.weekday, "tuesday");
  assert.equal(saturdayClose.next?.isoDate, "2026-01-20");
  assert.notEqual(saturdayClose.next?.relation, "tomorrow");
});

test("summer time still uses the Rome clock, not the visitor offset", () => {
  const winter = romeClock(new Date("2026-01-13T08:00:00.000Z"));
  const summer = romeClock(new Date("2026-07-07T07:00:00.000Z"));
  assert.equal(winter.minutes, 9 * 60);
  assert.equal(summer.minutes, 9 * 60);
  assert.equal(openingStatus(new Date("2026-07-07T07:00:00.000Z")).kind, "open");
  assert.equal(openingStatus(new Date("2026-07-07T06:59:00.000Z")).kind, "closed");
  assert.equal(romeTimeToUtc("2026-01-13", "09:00"), Date.parse("2026-01-13T08:00:00.000Z"));
  assert.equal(romeTimeToUtc("2026-07-07", "09:00"), Date.parse("2026-07-07T07:00:00.000Z"));
});

test("the day after the spring clock change still opens at 09:00 Rome", () => {
  const status = openingStatus(new Date("2026-03-31T07:00:00.000Z"));
  assert.deepEqual(status, { kind: "open", until: "12:30" });
  assert.equal(romeTimeToUtc("2026-10-25", "09:00"), Date.parse("2026-10-25T08:00:00.000Z"));
});

test("an exceptional closure and special hours replace the weekly pattern", () => {
  const config: OpeningHours = {
    ...openingHours,
    exceptions: [
      { date: "2026-01-13", intervals: [] },
      { date: "2026-01-17", intervals: [["10:00", "13:00"]] },
    ],
  };

  const holiday = openingStatus(new Date("2026-01-13T09:00:00.000Z"), config);
  assert.equal(holiday.kind, "closed");
  if (holiday.kind !== "closed") return;
  assert.equal(holiday.reason, "day");
  assert.equal(holiday.next?.isoDate, "2026-01-14");

  const special = openingStatus(new Date("2026-01-17T10:00:00.000Z"), config);
  assert.deepEqual(special, { kind: "open", until: "13:00" });

  const afterSpecial = openingStatus(new Date("2026-01-17T12:00:00.000Z"), config);
  assert.equal(afterSpecial.kind, "closed");
  if (afterSpecial.kind !== "closed") return;
  assert.equal(afterSpecial.next?.isoDate, "2026-01-20");
});

test("no opening inside the search window stays unresolved", () => {
  const status = openingStatus(new Date("2026-01-13T10:00:00.000Z"), closedWeek);
  assert.deepEqual(status, { kind: "closed", reason: "day", next: null });
});

test("the next change is the Rome boundary, including midnight", () => {
  const during = msUntilNextChange(new Date("2026-01-13T08:30:00.000Z"));
  assert.equal(during, Date.parse("2026-01-13T11:30:00.000Z") - Date.parse("2026-01-13T08:30:00.000Z"));

  const monday = msUntilNextChange(new Date("2026-01-12T22:30:00.000Z"));
  assert.equal(monday, Date.parse("2026-01-12T23:00:00.000Z") - Date.parse("2026-01-12T22:30:00.000Z"));
});

test("times follow the language and the public schema omits unconfirmed hours", () => {
  assert.match(formatTime("19:00", "it"), /19:00/);
  assert.match(formatTime("19:00", "fr"), /19:00/);
  assert.match(formatTime("19:00", "en").toLowerCase(), /7:00/);
  assert.equal("openingHoursSpecification" in beautySalonSchema("Naima"), false);
});
