import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { HeroSequence } from "@/features/hero/HeroSequence";
import { PartnersSection } from "@/features/marketing/PartnersSection";
import { BentoSection } from "@/features/marketing/BentoSection";
import { ChallengeSection } from "@/features/marketing/ChallengeSection";
import { PlatformSection } from "@/features/marketing/PlatformSection";
import { PossibilitiesSection } from "@/features/marketing/PossibilitiesSection";
import { SupplementSections } from "@/features/marketing/SupplementSections";
import { SystemStack } from "@/features/marketing/SystemStack";

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return buildPageMetadata({
    path: "/",
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <>
      {/* Scroll-driven film. HeroIntro inside it carries the page's <h1>
          ("Build what's next in insurance."), which is real DOM text rather
          than canvas, so it stays crawlable and readable to assistive tech. */}
      <HeroSequence />

      <PartnersSection locale={locale} />

      <PossibilitiesSection locale={locale} />

      <PlatformSection locale={locale} />

      <BentoSection locale={locale} />

      <SupplementSections locale={locale} />

      <SystemStack />

      <ChallengeSection locale={locale} />
    </>
  );
}
