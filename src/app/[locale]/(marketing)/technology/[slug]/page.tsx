import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, capabilityPath, technologyPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return builtSlugs.technology.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!builtSlugs.technology.includes(slug)) return {};

  const t = await getPageTranslations(locale, `technology.${slug}.meta`);

  return buildPageMetadata({
    path: technologyPath(slug),
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default function TechnologyRoute({ params: { locale, slug } }: Props) {
  if (!builtSlugs.technology.includes(slug)) notFound();
  setRequestLocale(locale);

  const foundation = getLocalizedPath(technologyPath("foundation"), locale);

  return (
    <ContentPage
      ctaHrefs={{
        convert: getLocalizedPath("/contact", locale),
        // Foundation is the hub of this family, so every other page evaluates
        // back to it; Foundation itself sends the reader on to Trust instead.
        evaluate:
          slug === "foundation"
            ? getLocalizedPath(technologyPath("trust-security-operational-resilience"), locale)
            : foundation,
        explore:
          slug === "integrations"
            ? getLocalizedPath(capabilityPath("api-microservices"), locale)
            : getLocalizedPath(technologyPath("integrations"), locale),
      }}
      locale={locale}
      namespace={`technology.${slug}`}
      primaryHref={getLocalizedPath("/contact", locale)}
      secondaryHref={slug === "foundation" ? getLocalizedPath(technologyPath("integrations"), locale) : foundation}
    />
  );
}
