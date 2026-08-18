import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, productPath, solutionPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return builtSlugs.solutions.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!builtSlugs.solutions.includes(slug)) return {};

  const t = await getPageTranslations(locale, `solutions.${slug}.meta`);

  return buildPageMetadata({
    path: solutionPath(slug),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function SolutionRoute({ params: { locale, slug } }: Props) {
  if (!builtSlugs.solutions.includes(slug)) notFound();
  setRequestLocale(locale);

  const salesverse = getLocalizedPath(productPath("salesverse"), locale);

  return (
    <ContentPage
      ctaHrefs={{
        convert: getLocalizedPath("/contact", locale),
        evaluate: salesverse,
        explore: getLocalizedPath(productPath("salesverse", "use-cases"), locale),
      }}
      locale={locale}
      namespace={`solutions.${slug}`}
      primaryHref={getLocalizedPath("/contact", locale)}
      secondaryHref={salesverse}
    />
  );
}
