import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import en from "./messages/en";
import { locales, parkedLocales } from "./config";

/** Flattens { a: { b: "x" } } to ["a.b"] so bundles can be compared by key. */
function keysOf(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? keysOf(value as Record<string, unknown>, path)
      : [path];
  });
}

const bundles: Record<string, Record<string, unknown>> = { en };

describe("translation bundles", () => {
  it("has a bundle for every active locale", () => {
    for (const locale of locales) expect(bundles[locale], `missing ${locale}.json`).toBeDefined();
  });

  it("keeps every active locale in sync with the English keys", () => {
    const base = keysOf(en).sort();
    for (const locale of locales) {
      expect(keysOf(bundles[locale]!).sort(), `${locale}.json drifted`).toEqual(base);
    }
  });

  it("keeps parked translations on disk so they are not lost", () => {
    // These are intentionally not key-checked while inactive — they will drift
    // as the English copy changes and need a re-sync plus native review before
    // being switched back on. See core/i18n/config.ts.
    for (const locale of parkedLocales) {
      const path = fileURLToPath(new URL(`./messages/${locale}.json`, import.meta.url));
      expect(existsSync(path), `${locale}.json is missing`).toBe(true);
    }
  });
});
