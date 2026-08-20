import { PageHero } from "@/components/sections/PageHero";
import { FeatureList, Section, bandTone, type FeatureItem } from "@/components/sections/Section";
import { CtaBand } from "@/components/sections/Blocks";
import Link from "next/link";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";
import { productPath } from "@/config/site.config";
import { productBrand } from "@/config/brand.config";

/**
 * Product use-cases page.
 *
 * Every case follows the spec's three-beat structure — business situation, how
 * the product is used, what changes. The labels are translated rather than
 * hardcoded because they name the product ("How SalesVerse is used").
 */
type UseCase = {
  number: string;
  title: string;
  situation: string;
  usage: string;
  change: string;
};

/**
 * The automation, intelligence and analytics section shared by the product
 * Features and Use Cases pages. Its claims are derived from that product's own
 * Automation, Intelligence & Analytics page rather than newly asserted, so the
 * three pages cannot drift apart. `note` is optional: MerchantVerse makes no
 * AI claim and so states no human-responsibility boundary here.
 */
type AutomationBlock = {
  eyebrow: string;
  title: string;
  features: FeatureItem[];
  note?: string;
  cta: string;
};

export async function ProductUseCasesPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = await getPageTranslations(locale, `products.${slug}.useCases`);

  const hero = t.raw("hero") as {
    eyebrow: string;
    title: string;
    lede: string;
    primary: string;
    secondary: string;
  };
  const labels = t.raw("labels") as { situation: string; usage: string; change: string };
  const automation = t.raw("automation") as AutomationBlock;
  const cases = t.raw("cases") as UseCase[];
  const cta = t.raw("cta") as {
    title: string;
    convert: string;
    evaluate: string;
    explore: string;
  };

  const demoHref = getLocalizedPath("/contact", locale);
  const overviewHref = getLocalizedPath(productPath(slug), locale);
  const featuresHref = getLocalizedPath(productPath(slug, "features"), locale);
  const aiHref = getLocalizedPath(productPath(slug, "automation-intelligence-analytics"), locale);

  // Carries the product's brand palette through the whole page body (not
  // just the hero) — everywhere except the header and footer, which stay
  // neutral regardless of which product page is open.
  const tint = productBrand[slug];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        lede={hero.lede}
        primary={{ label: hero.primary, href: demoHref }}
        secondary={{ label: hero.secondary, href: featuresHref }}
        title={hero.title}
        tint={tint}
      />

      {cases.map((useCase, index) => (
        <Section
          key={useCase.number}
          number={useCase.number}
          title={useCase.title}
          tone={bandTone(index)}
          tint={tint}
        >
          <dl className="usecase">
            <div className="usecase__row">
              <dt className="usecase__label">{labels.situation}</dt>
              <dd className="usecase__text">{useCase.situation}</dd>
            </div>
            <div className="usecase__row">
              <dt className="usecase__label">{labels.usage}</dt>
              <dd className="usecase__text">{useCase.usage}</dd>
            </div>
            <div className="usecase__row usecase__row--change">
              <dt className="usecase__label">{labels.change}</dt>
              <dd className="usecase__text">{useCase.change}</dd>
            </div>
          </dl>
        </Section>
      ))}

      <Section
        eyebrow={automation.eyebrow}
        tint={tint}
        title={automation.title}
        tone={bandTone(cases.length)}
      >
        <FeatureList items={automation.features} />
        {automation.note ? <p className="sec__note">{automation.note}</p> : null}
        <p className="supplement__gap">
          <Link className="related__link" href={aiHref}>
            {automation.cta}
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </Section>

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        evaluate={{ label: cta.evaluate, href: featuresHref }}
        explore={{ label: cta.explore, href: overviewHref }}
        title={cta.title}
        tint={tint}
      />
    </>
  );
}
