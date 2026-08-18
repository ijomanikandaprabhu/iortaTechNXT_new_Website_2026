import type { Metadata } from "next";
import { appConfig } from "@/config/app.config";
import { seoConfig } from "@/config/seo.config";
import type { Locale } from "@/core/i18n/config";
import { localeTags } from "@/core/i18n/config";
import { getTenant } from "@/core/tenancy/getTenant";
import { buildAlternates } from "./hreflang";

type PageMetadataArgs = {
  /** Locale-less route, e.g. "/" or "/contact". */
  path: string;
  locale: Locale;
  /**
   * Already-resolved strings rather than a namespace to read them from.
   *
   * This used to take `namespace: "home" | "contact"` and call
   * `t("meta.title")` itself, which meant every new page had to widen that
   * union before it would compile. It also could not express the nested
   * namespaces the page templates use (`products.salesverse.overview`), and
   * typing dotted namespace paths is fragile. Callers read their own two
   * strings instead; page templates do it once for every page of their type.
   */
  title: string;
  description: string;
  /** Set false for private routes such as the dashboard. */
  index?: boolean;
};

/**
 * The single place page metadata is assembled. Every localized page calls this
 * from generateMetadata() instead of hand-writing titles and alternates.
 */
export async function buildPageMetadata({
  path,
  locale,
  title,
  description,
  index = true,
}: PageMetadataArgs): Promise<Metadata> {
  const tenant = getTenant();
  const { siteName, twitter } = seoConfig[tenant];

  const alternates = buildAlternates(path, locale);

  return {
    metadataBase: new URL(appConfig.siteUrl),
    title: { default: title, template: `%s | ${siteName}` },
    description,
    alternates,
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: alternates.canonical,
      locale: localeTags[locale],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitter ? { site: twitter } : {}),
    },
  };
}
