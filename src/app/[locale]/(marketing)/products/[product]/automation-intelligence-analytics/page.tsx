import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { productBrand } from "@/config/brand.config";
import { builtSlugs, productPath, STANDALONE_PATHS } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; product: string } };

export function generateStaticParams() {
  return builtSlugs.products.map((product) => ({ product }));
}

export async function generateMetadata({ params: { locale, product } }: Props): Promise<Metadata> {
  if (!builtSlugs.products.includes(product)) return {};

  const t = await getPageTranslations(locale, `products.${product}.automationIntelligenceAnalytics.meta`);

  return buildPageMetadata({
    path: productPath(product, "automation-intelligence-analytics"),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

/**
 * The product AI & analytics page.
 *
 * Reuses `ContentPage` rather than adding a fourth product template: this page
 * is a hero plus a run of numbered capability sections and a CTA, which is
 * exactly the skeleton ContentPage already renders. The only product-specific
 * part is the palette, which it now takes as a prop.
 */
export default function ProductAiAnalyticsRoute({ params: { locale, product } }: Props) {
  if (!builtSlugs.products.includes(product)) notFound();
  setRequestLocale(locale);

  return (
    <ContentPage
      ctaHrefs={{
        convert: getLocalizedPath(STANDALONE_PATHS.requestDemo, locale),
        evaluate: getLocalizedPath(productPath(product, "use-cases"), locale),
        explore: getLocalizedPath(productPath(product, "features"), locale),
      }}
      locale={locale}
      namespace={`products.${product}.automationIntelligenceAnalytics`}
      primaryHref={getLocalizedPath(STANDALONE_PATHS.requestDemo, locale)}
      secondaryHref={getLocalizedPath(productPath(product, "features"), locale)}
      tint={productBrand[product]}
    />
  );
}
