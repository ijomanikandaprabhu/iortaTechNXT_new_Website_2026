import type { AbstractIntlMessages } from "next-intl";
import type { Locale } from "../config";

/**
 * Loads a locale's message bundle.
 *
 * English is assembled from per-area files by `en.ts`; the parked locales are
 * still single JSON files. Keeping that difference behind one function means
 * `request.ts` does not have to know about it, and re-enabling Thai or
 * Vietnamese later is a change here rather than a change at every call site.
 */
export async function loadMessages(locale: Locale): Promise<AbstractIntlMessages> {
  if (locale === "en") {
    // Cast because `AbstractIntlMessages` models values as string or nested
    // object only — it has no array case, while the bundle legitimately holds
    // arrays that components read through `t.raw()` (see home.possibilities
    // .words, consumed by LoopingWords). The values are valid at runtime; the
    // published type is simply narrower than what next-intl accepts.
    return (await import("./en")).default as unknown as AbstractIntlMessages;
  }

  // Parked locales (see core/i18n/config.ts) still ship as one file each.
  return (await import(`./${locale}.json`)).default;
}
