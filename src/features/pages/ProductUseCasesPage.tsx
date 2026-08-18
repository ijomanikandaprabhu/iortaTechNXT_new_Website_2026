import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { CtaBand } from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";
import { productPath } from "@/config/site.config";

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

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        lede={hero.lede}
        primary={{ label: hero.primary, href: demoHref }}
        secondary={{ label: hero.secondary, href: featuresHref }}
        title={hero.title}
      />

      {cases.map((useCase, index) => (
        <Section
          key={useCase.number}
          number={useCase.number}
          title={useCase.title}
          tone={index % 2 === 1 ? "muted" : undefined}
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

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        evaluate={{ label: cta.evaluate, href: featuresHref }}
        explore={{ label: cta.explore, href: overviewHref }}
        title={cta.title}
      />
    </>
  );
}
