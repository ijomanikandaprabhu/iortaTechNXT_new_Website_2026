import type { MetadataRoute } from "next";
import { publicPaths } from "@/config/seo.config";
import { defaultLocale, locales, localeTags } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { absoluteUrl } from "@/core/seo/hreflang";

/**
 * One entry per (path, locale), each carrying the full alternates map so
 * crawlers see the language cluster. Driven by seo.config.publicPaths.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((l) => [localeTags[l], absoluteUrl(getLocalizedPath(path, l))]),
    );

    return locales.map((locale) => ({
      url: absoluteUrl(getLocalizedPath(path, locale)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: { ...languages, "x-default": absoluteUrl(getLocalizedPath(path, defaultLocale)) },
      },
    }));
  });
}
