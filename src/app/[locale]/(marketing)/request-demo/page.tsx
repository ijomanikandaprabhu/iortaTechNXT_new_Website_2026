import type { Metadata } from "next";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { STANDALONE_PATHS, builtSlugs } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { FormPage } from "@/features/pages/FormPage";

type Props = {
  params: { locale: Locale };
  /** `?product=salesverse` preselects that product, per the spec. */
  searchParams: { product?: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getPageTranslations(locale, "request-demo.meta");

  return buildPageMetadata({
    path: STANDALONE_PATHS.requestDemo,
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function RequestDemoRoute({ params: { locale }, searchParams }: Props) {
  setRequestLocale(locale);

  // Checked against the registry so a crafted query string cannot inject an
  // arbitrary value into the form and on into the CRM.
  const product =
    searchParams.product && builtSlugs.products.includes(searchParams.product)
      ? searchParams.product
      : undefined;

  return (
    <FormPage
      locale={locale}
      namespace="request-demo"
      preselect={product ? { field: "product", value: product } : undefined}
      source="request-demo"
    />
  );
}
