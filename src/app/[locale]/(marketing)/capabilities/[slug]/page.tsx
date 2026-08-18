import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, capabilityPath, productPath, solutionPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return builtSlugs.capabilities.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!builtSlugs.capabilities.includes(slug)) return {};

  const t = await getPageTranslations(locale, `capabilities.${slug}.meta`);

  return buildPageMetadata({
    path: capabilityPath(slug),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function CapabilityRoute({ params: { locale, slug } }: Props) {
  if (!builtSlugs.capabilities.includes(slug)) notFound();
  setRequestLocale(locale);

  const salesverse = getLocalizedPath(productPath("salesverse"), locale);

  return (
    <ContentPage
      ctaHrefs={{
        convert: getLocalizedPath("/contact", locale),
        evaluate: salesverse,
        explore: getLocalizedPath(solutionPath("distribution-modernization"), locale),
      }}
      locale={locale}
      namespace={`capabilities.${slug}`}
      primaryHref={getLocalizedPath("/contact", locale)}
      secondaryHref={salesverse}
    />
  );
}
