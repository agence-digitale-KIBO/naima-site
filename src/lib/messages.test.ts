import assert from "node:assert/strict";
import test from "node:test";
import en from "../../messages/en.json" with { type: "json" };
import fr from "../../messages/fr.json" with { type: "json" };
import it from "../../messages/it.json" with { type: "json" };
import { portfolio } from "../config/portfolio";
import { reviews } from "../config/reviews";

function keys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keys(item, `${prefix}${index}.`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      keys(item, `${prefix}${key}.`),
    );
  }
  return [prefix.slice(0, -1)];
}

test("Italian, French and English expose the same message keys", () => {
  const italian = keys(it).sort();
  assert.deepEqual(keys(fr).sort(), italian);
  assert.deepEqual(keys(en).sort(), italian);
});

test("portfolio and reviews stay empty until Naima provides them", () => {
  assert.equal(portfolio.length, 0);
  assert.equal(reviews.length, 0);
});
