import assert from "node:assert/strict";
import test from "node:test";
import { getCalLink, getCalUrl, hasAnyCalLink } from "./booking";

test("booking stays closed without Naima's Cal.com account", () => {
  const previousUser = process.env.NEXT_PUBLIC_CAL_USERNAME;
  const previousEvent = process.env.NEXT_PUBLIC_CAL_EVENT_NAILS;
  delete process.env.NEXT_PUBLIC_CAL_USERNAME;
  delete process.env.NEXT_PUBLIC_CAL_EVENT_NAILS;

  assert.equal(getCalLink("nails"), null);
  assert.equal(getCalUrl("nails"), null);
  assert.equal(hasAnyCalLink(), false);

  process.env.NEXT_PUBLIC_CAL_USERNAME = previousUser;
  process.env.NEXT_PUBLIC_CAL_EVENT_NAILS = previousEvent;
});

test("a configured event becomes a public Cal.com link", () => {
  const previousUser = process.env.NEXT_PUBLIC_CAL_USERNAME;
  const previousEvent = process.env.NEXT_PUBLIC_CAL_EVENT_MAKEUP;
  process.env.NEXT_PUBLIC_CAL_USERNAME = "naima-natoli";
  process.env.NEXT_PUBLIC_CAL_EVENT_MAKEUP = "trucco-sposa";

  assert.equal(getCalLink("makeup"), "naima-natoli/trucco-sposa");
  assert.equal(getCalUrl("makeup"), "https://cal.com/naima-natoli/trucco-sposa");
  assert.equal(hasAnyCalLink(), true);

  process.env.NEXT_PUBLIC_CAL_USERNAME = previousUser;
  process.env.NEXT_PUBLIC_CAL_EVENT_MAKEUP = previousEvent;
});
