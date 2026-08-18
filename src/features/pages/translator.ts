import { getTranslations } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";

/**
 * A translator for a message namespace that is only known at runtime.
 *
 * next-intl types `namespace` as a union of every literal path in the bundle,
 * which is exactly what you want when the namespace is written by hand. The
 * page templates cannot use it: their namespace is assembled from a URL slug
 * (`products.salesverse.overview`), so no literal type exists at the call site.
 *
 * This wraps that one unavoidable cast in a single place rather than scattering
 * it through every template and route, and returns a translator with plain
 * string keys. The safety it gives up is recovered at the route: a slug is
 * checked against the registry and 404s before any lookup happens, and the
 * shape of each block is asserted where `raw()` is read.
 */
export type PageTranslator = {
  (key: string): string;
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
};

export async function getPageTranslations(
  locale: Locale,
  namespace: string,
): Promise<PageTranslator> {
  const t = await getTranslations({ locale, namespace: namespace as never });
  return t as unknown as PageTranslator;
}
