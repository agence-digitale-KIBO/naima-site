import assert from "node:assert/strict";
import test from "node:test";
import { parseContact } from "./contact";

const valid = {
  name: "Giulia",
  email: "giulia@example.com",
  message: "Vorrei un appuntamento per una manicure.",
  consent: true,
  website: "",
  startedAt: 1_000,
  locale: "it",
};

test("accepts a complete message", () => {
  const result = parseContact(valid, 3_000);
  assert.equal(result.status, "ready");
});

test("rejects a missing consent and a short message", () => {
  const result = parseContact({ ...valid, consent: false, message: "ciao" }, 3_000);
  assert.equal(result.status, "invalid");
  if (result.status === "invalid") {
    assert.equal(result.fields.consent, "consent");
    assert.equal(result.fields.message, "message");
  }
});

test("treats a filled honeypot as a silent success", () => {
  const result = parseContact({ ...valid, website: "https://spam.example" }, 3_000);
  assert.equal(result.status, "success");
});

test("rejects a submission that is too fast", () => {
  const result = parseContact(valid, 1_200);
  assert.equal(result.status, "invalid");
});
