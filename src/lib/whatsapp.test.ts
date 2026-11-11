import assert from "node:assert/strict";
import test from "node:test";
import { whatsappUrl } from "./whatsapp";

test("builds the official WhatsApp link with the supplied message", () => {
  const url = new URL(whatsappUrl("Ciao Naima! Vorrei avere informazioni sui tuoi trattamenti."));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/393463707680");
  assert.equal(url.searchParams.get("text"), "Ciao Naima! Vorrei avere informazioni sui tuoi trattamenti.");
});
