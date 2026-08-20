import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductSubNav, type SubNavItem } from "@/components/layout/ProductSubNav";
import { productBrand } from "@/config/brand.config";
import { PRODUCT_SECTIONS, builtSlugs, productPath, STANDALONE_PATHS } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { getPageTranslations } from "@/features/pages/translator";

/**
 * Wraps every product route with the per-product sub-header.
 *
 * It lives in a layout rather than in each of the four page templates so the bar
 * is defined once, and so it survives navigation between a product's sections
 * instead of unmounting and remounting on each one.
 */
export default async function ProductLayout({
  children,
  params: { locale, product },
}: {
  children: React.ReactNode;
  params: { locale: Locale; product: string };
}) {
  if (!builtSlugs.products.includes(product)) notFound();

  const t = await getTranslations({ locale, namespace: "nav" });
  /**
   * `nav.productNames` is upper-cased for the mega panel's column headings. The
   * bar wants the product's own display name, which the product bundle carries.
   */
  const tProduct = await getPageTranslations(locale, `products.${product}`);

  /**
   * Overview is deliberately not in this list. The product name at the left of
   * the bar links there, so a nav item for it would be a second route to the
   * same page and one more label competing for the row.
   */
  const items: SubNavItem[] = PRODUCT_SECTIONS.filter((section) => section !== "overview").map(
    (section) => ({
      label: t(`productSections.${section}`),
      href: getLocalizedPath(productPath(product, section), locale),
    }),
  );

  return (
    <>
      <ProductSubNav
        demo={{
          label: t("productSections.request-demo"),
          href: getLocalizedPath(STANDALONE_PATHS.requestDemo, locale),
        }}
        home={getLocalizedPath(productPath(product), locale)}
        items={items}
        labels={{ menu: t("menu"), close: t("close") }}
        productName={tProduct("name")}
        tint={productBrand[product]}
      />
      {children}
    </>
  );
}
