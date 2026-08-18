import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { builtSlugs, legalPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { buildPageMetadata } from "@/core/seo/metadata";
import { getPageTranslations } from "@/features/pages/translator";
import { ContentPage } from "@/features/pages/ContentPage";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return builtSlugs.legal.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  if (!builtSlugs.legal.includes(slug)) return {};

  const t = await getPageTranslations(locale, `legal.${slug}.meta`);

  return buildPageMetadata({
    path: legalPath(slug),
    locale,
    title: t("title"),
    description: t("description"),
    // Policy pages carry no marketing value in search and change under legal
    // review rather than on a content schedule, but they must stay reachable
    // and indexable so people can actually find them.
    index: true,
  });
}

export default function LegalRoute({ params: { locale, slug } }: Props) {
  if (!builtSlugs.legal.includes(slug)) notFound();
  setRequestLocale(locale);

  return (
    <ContentPage
      // Only Accessibility and Responsible Disclosure define a CTA; the rest
      // end without one, which ContentPage now allows.
      ctaHrefs={{ convert: getLocalizedPath("/contact", locale) }}
      locale={locale}
      namespace={`legal.${slug}`}
      primaryHref={getLocalizedPath("/contact", locale)}
    />
  );
}
