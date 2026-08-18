import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { STANDALONE_PATHS, companyPath, resourcePath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ListingPage } from "@/features/pages/ListingPage";

/**
 * Insights and News & Events.
 *
 * Newsletter also lives under /resources but is a form rather than a listing,
 * so it has its own sibling route. A static segment wins over this dynamic one,
 * so the two coexist without a branch here.
 */
const LISTINGS = ["insights", "news-events"];

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return LISTINGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!LISTINGS.includes(slug)) return {};

  const t = await getPageTranslations(locale, `resources.${slug}.meta`);

  return buildPageMetadata({
    path: resourcePath(slug),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function ResourceRoute({ params: { locale, slug } }: Props) {
  if (!LISTINGS.includes(slug)) notFound();
  setRequestLocale(locale);

  const newsletter = getLocalizedPath(resourcePath("newsletter"), locale);

  return (
    <ListingPage
      ctaHrefs={{
        convert: newsletter,
        evaluate:
          slug === "insights"
            ? getLocalizedPath(STANDALONE_PATHS.customers, locale)
            : getLocalizedPath(resourcePath("insights"), locale),
        explore:
          slug === "insights"
            ? getLocalizedPath(resourcePath("news-events"), locale)
            : getLocalizedPath(companyPath("about"), locale),
      }}
      locale={locale}
      namespace={`resources.${slug}`}
      primaryHref={newsletter}
      secondaryHref={getLocalizedPath("/contact", locale)}
    />
  );
}
