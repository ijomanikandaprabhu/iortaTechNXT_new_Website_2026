import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, productPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ProductOverviewPage } from "@/features/pages/ProductOverviewPage";

type Props = { params: { locale: Locale; product: string } };

/**
 * Only products marked `built` in the registry are pre-rendered, so a slug
 * whose content does not exist yet cannot ship as a broken page.
 */
export function generateStaticParams() {
  return builtSlugs.products.map((product) => ({ product }));
}

export async function generateMetadata({ params: { locale, product } }: Props): Promise<Metadata> {
  if (!builtSlugs.products.includes(product)) return {};

  const t = await getPageTranslations(locale, `products.${product}.overview.meta`);

  return buildPageMetadata({
    path: productPath(product),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function ProductOverviewRoute({ params: { locale, product } }: Props) {
  if (!builtSlugs.products.includes(product)) notFound();
  setRequestLocale(locale);

  return <ProductOverviewPage locale={locale} slug={product} />;
}
