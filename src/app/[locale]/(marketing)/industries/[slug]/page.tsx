import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, industryPath, productPath, solutionPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return builtSlugs.industries.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!builtSlugs.industries.includes(slug)) return {};

  const t = await getPageTranslations(locale, `industries.${slug}.meta`);

  return buildPageMetadata({
    path: industryPath(slug),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function IndustryRoute({ params: { locale, slug } }: Props) {
  if (!builtSlugs.industries.includes(slug)) notFound();
  setRequestLocale(locale);

  const distribution = getLocalizedPath(solutionPath("distribution-modernization"), locale);

  return (
    <ContentPage
      ctaHrefs={{
        convert: getLocalizedPath("/contact", locale),
        evaluate: distribution,
        explore: getLocalizedPath(productPath("salesverse"), locale),
      }}
      locale={locale}
      namespace={`industries.${slug}`}
      primaryHref={getLocalizedPath("/contact", locale)}
      secondaryHref={distribution}
    />
  );
}
