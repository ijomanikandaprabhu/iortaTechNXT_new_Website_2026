import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { JourneySteps, Prose, Section, TagList, bandTone } from "@/components/sections/Section";
import {
  CtaBand,
  FaqList,
  ProofBlock,
  RoleGrid,
  type FaqItem,
  type RoleItem,
} from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";
import { productPath } from "@/config/site.config";
import { productBrand } from "@/config/brand.config";

/**
 * Product overview page.
 *
 * Follows the spec's hierarchy for this page type: why the problem exists,
 * what the product is, the journey it runs, who it is built for, the
 * intelligence layer, what it connects to, what changes for the business,
 * proof, questions, and the conversion band.
 */
export async function ProductOverviewPage({ locale, slug }: { locale: Locale; slug: string }) {
  // Namespace is assembled from a slug already checked against the registry.
  const t = await getPageTranslations(locale, `products.${slug}.overview`);

  const hero = t.raw("hero") as {
    eyebrow: string;
    title: string;
    lede: string;
    primary: string;
    secondary: string;
  };
  const problem = t.raw("problem") as { eyebrow: string; title: string; body: string[] };
  const journey = t.raw("journey") as {
    eyebrow: string;
    title: string;
    steps: string[];
    body: string;
  };
  const builtFor = t.raw("builtFor") as { eyebrow: string; title: string; items: RoleItem[] };
  const intelligence = t.raw("intelligence") as {
    eyebrow: string;
    title: string;
    body: string;
  };
  const integration = t.raw("integration") as {
    eyebrow: string;
    title: string;
    body: string;
    tags: string[];
  };
  const outcomes = t.raw("outcomes") as { eyebrow: string; title: string; items: RoleItem[] };
  const proof = t.raw("proof") as {
    eyebrow: string;
    title: string;
    body: string;
    pending: string;
    pendingNote: string;
  };
  const faq = t.raw("faq") as { eyebrow: string; title: string; items: FaqItem[] };
  /**
   * `responsibility` is optional on purpose. Every product states who stays in
   * control of the judgement calls — except MerchantVerse, whose spec block
   * carries no such line because its AI capability is not yet validated for
   * publication.
   */
  const automation = t.raw("automation") as {
    eyebrow: string;
    title: string;
    body: string;
    responsibility?: string;
    cta: string;
  };
  const cta = t.raw("cta") as { title: string; convert: string; explore: string };

  const demoHref = getLocalizedPath("/contact", locale);
  const featuresHref = getLocalizedPath(productPath(slug, "features"), locale);
  const useCasesHref = getLocalizedPath(productPath(slug, "use-cases"), locale);
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

      {/* Band tones come from the shared rhythm, indexed in render order, so
          this page keeps the same two-light-then-dark cadence as every other. */}
      <Section eyebrow={problem.eyebrow} title={problem.title} tint={tint} tone={bandTone(0)}>
        <Prose paragraphs={problem.body} />
      </Section>

      <Section
        eyebrow={journey.eyebrow}
        lede={journey.body}
        title={journey.title}
        tint={tint}
        tone={bandTone(1)}
      >
        <JourneySteps steps={journey.steps} />
      </Section>

      <Section eyebrow={builtFor.eyebrow} title={builtFor.title} tint={tint} tone={bandTone(2)}>
        <RoleGrid items={builtFor.items} />
      </Section>

      <Section
        eyebrow={intelligence.eyebrow}
        lede={intelligence.body}
        title={intelligence.title}
        tint={tint}
        tone={bandTone(3)}
      />

      <Section
        eyebrow={integration.eyebrow}
        lede={integration.body}
        title={integration.title}
        tint={tint}
        tone={bandTone(4)}
      >
        <TagList items={integration.tags} />
      </Section>

      <Section eyebrow={outcomes.eyebrow} title={outcomes.title} tint={tint} tone={bandTone(5)}>
        <RoleGrid items={outcomes.items} />
      </Section>

      <Section eyebrow={proof.eyebrow} title={proof.title} tint={tint} tone={bandTone(6)}>
        <ProofBlock body={proof.body} pending pendingNote={proof.pendingNote} />
      </Section>

      <Section eyebrow={faq.eyebrow} title={faq.title} tint={tint} tone={bandTone(7)}>
        <FaqList items={faq.items} />
      </Section>

      {/* The spec places this after the questions and immediately before the
          conversion band: it is the last thing read before the ask. */}
      <Section
        eyebrow={automation.eyebrow}
        lede={automation.body}
        title={automation.title}
        tint={tint}
        tone={bandTone(8)}
      >
        {automation.responsibility ? (
          <p className="sec__note">{automation.responsibility}</p>
        ) : null}
        <Link className="related__link" href={aiHref}>
          {automation.cta}
          <span aria-hidden="true"> →</span>
        </Link>
      </Section>

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        explore={{ label: cta.explore, href: useCasesHref }}
        title={cta.title}
        tint={tint}
      />
    </>
  );
}
