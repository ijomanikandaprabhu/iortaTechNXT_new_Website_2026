import type { Metadata } from "next";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { STANDALONE_PATHS, resourcePath, technologyPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ListingPage } from "@/features/pages/ListingPage";

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getPageTranslations(locale, "customers.meta");

  return buildPageMetadata({
    path: STANDALONE_PATHS.customers,
    locale,
    title: t("title"),
    description: t("description"),
  });
}

/**
 * The customer-story index.
 *
 * There is deliberately no `/customers/[slug]` detail route yet. The spec
 * allows a story to be published only once the customer name, quotations and
 * metrics are approved for external use, and none has cleared that. Adding the
 * route now would either 404 for every slug or invite an unapproved story to be
 * dropped in; the four engagements are listed here as unlinked cards instead.
 */
export default function CustomersRoute({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <ListingPage
      ctaHrefs={{
        convert: getLocalizedPath("/contact", locale),
        evaluate: getLocalizedPath(technologyPath("implementation-customer-success"), locale),
        explore: getLocalizedPath(resourcePath("insights"), locale),
      }}
      locale={locale}
      namespace="customers"
      primaryHref={getLocalizedPath("/contact", locale)}
      secondaryHref={getLocalizedPath(resourcePath("insights"), locale)}
    />
  );
}
