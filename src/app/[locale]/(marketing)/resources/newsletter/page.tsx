import type { Metadata } from "next";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { resourcePath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { FormPage } from "@/features/pages/FormPage";

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getPageTranslations(locale, "resources.newsletter.meta");

  return buildPageMetadata({
    path: resourcePath("newsletter"),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function NewsletterRoute({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return <FormPage locale={locale} namespace="resources.newsletter" source="newsletter" />;
}
