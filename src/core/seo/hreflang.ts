import { appConfig } from "@/config/app.config";
import { defaultLocale, locales, localeTags } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";

/**
 * Builds the alternates block for Next's Metadata API: a canonical URL for the
 * current locale plus one hreflang entry per locale and an x-default.
 */
export function buildAlternates(path: string, locale: string) {
  const languages: Record<string, string> = {};

  for (const l of locales) {
    languages[localeTags[l]] = absoluteUrl(getLocalizedPath(path, l));
  }
  languages["x-default"] = absoluteUrl(getLocalizedPath(path, defaultLocale));

  return {
    canonical: absoluteUrl(getLocalizedPath(path, locale as (typeof locales)[number])),
    languages,
  };
}

export function absoluteUrl(path: string): string {
  return `${appConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
