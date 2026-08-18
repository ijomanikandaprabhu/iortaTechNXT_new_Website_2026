/**
 * Single source of truth for supported languages.
 * Adding a locale = add it here + add src/core/i18n/messages/<locale>.json.
 */
/**
 * Active languages.
 *
 * English-only while the copy is still being written. Thai and Vietnamese
 * bundles are parked in ./messages/ and are NOT key-checked against English
 * while inactive, so they will drift as the English copy changes.
 *
 * To re-enable, once the English narrative is signed off:
 *   1. re-sync th.json / vi.json against en.json and have a native speaker
 *      review them — the marketing copy carries brand voice, not just meaning
 *   2. add the codes back to `locales`, `localeNames` and `localeTags` below
 *   3. restore the multi-locale cases in routing.test.ts and messages.test.ts
 *
 * Nothing else needs touching: routing, middleware, hreflang, the sitemap and
 * the language switcher all derive from this array, and URLs are already
 * locale-prefixed (/en/...) so existing links keep working.
 */
export const locales = ["en"] as const;

/** Languages with translations on disk, awaiting review. See above. */
export const parkedLocales = ["th", "vi"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Human-readable names, used in the language switcher and hreflang debugging. */
export const localeNames: Record<Locale, string> = {
  en: "English",
};

/** BCP-47 tags for <html lang> and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
