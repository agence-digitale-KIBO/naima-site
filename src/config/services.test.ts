import assert from "node:assert/strict";
import test from "node:test";
import { canonicalServiceSlug, resolveServiceId } from "./services";

test("resolves localized slugs to the same service", () => {
  assert.equal(resolveServiceId("unghie-mani-piedi"), "nails");
  assert.equal(resolveServiceId("ongles-mains-pieds"), "nails");
  assert.equal(resolveServiceId("nails-hands-feet"), "nails");
  assert.equal(resolveServiceId("epilazione-laser"), "laser");
  assert.equal(resolveServiceId("unknown"), null);
});

test("canonical slugs stay in the page language", () => {
  assert.equal(canonicalServiceSlug("lashes", "it"), "ciglia-sguardo");
  assert.equal(canonicalServiceSlug("lashes", "fr"), "cils-regard");
  assert.equal(canonicalServiceSlug("headSpa", "en"), "head-spa");
});
