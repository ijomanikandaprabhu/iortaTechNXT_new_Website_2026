import { defaultLocale, isLocale, locales, type Locale } from "./config";

/**
 * URL helpers. Every localized link in the app must be built here so the
 * prefixing rule lives in exactly one place (DRY).
 */

/** Normalizes "contact", "/contact", "" -> "/contact", "/". */
function normalize(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** "/contact" + "th" -> "/th/contact" */
export function getLocalizedPath(path: string, locale: Locale): string {
  const clean = normalize(path);
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** "/hi/contact" -> "/contact"; strips a leading locale segment if present. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) {
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return normalize(pathname);
}

/** "/th/contact" -> "th"; falls back to the default locale. */
export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) ? first : defaultLocale;
}

/** Every locale variant of a locale-less path. Used for hreflang and sitemaps. */
export function getAllLocalizedPaths(path: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, getLocalizedPath(path, l)])) as Record<
    Locale,
    string
  >;
}
