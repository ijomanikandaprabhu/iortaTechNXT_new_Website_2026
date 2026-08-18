import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, productPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ProductFeaturesPage } from "@/features/pages/ProductFeaturesPage";

type Props = { params: { locale: Locale; product: string } };

export function generateStaticParams() {
  return builtSlugs.products.map((product) => ({ product }));
}

export async function generateMetadata({ params: { locale, product } }: Props): Promise<Metadata> {
  if (!builtSlugs.products.includes(product)) return {};

  const t = await getPageTranslations(locale, `products.${product}.features.meta`);

  return buildPageMetadata({
    path: productPath(product, "features"),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function ProductFeaturesRoute({ params: { locale, product } }: Props) {
  if (!builtSlugs.products.includes(product)) notFound();
  setRequestLocale(locale);

  return <ProductFeaturesPage locale={locale} slug={product} />;
}
