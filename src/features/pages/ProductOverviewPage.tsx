import { PageHero } from "@/components/sections/PageHero";
import { JourneySteps, Prose, Section, TagList } from "@/components/sections/Section";
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
  const cta = t.raw("cta") as { title: string; convert: string; explore: string };

  const demoHref = getLocalizedPath("/contact", locale);
  const featuresHref = getLocalizedPath(productPath(slug, "features"), locale);
  const useCasesHref = getLocalizedPath(productPath(slug, "use-cases"), locale);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        lede={hero.lede}
        primary={{ label: hero.primary, href: demoHref }}
        secondary={{ label: hero.secondary, href: featuresHref }}
        title={hero.title}
      />

      <Section eyebrow={problem.eyebrow} title={problem.title}>
        <Prose paragraphs={problem.body} />
      </Section>

      <Section eyebrow={journey.eyebrow} lede={journey.body} title={journey.title} tone="muted">
        <JourneySteps steps={journey.steps} />
      </Section>

      <Section eyebrow={builtFor.eyebrow} title={builtFor.title}>
        <RoleGrid items={builtFor.items} />
      </Section>

      <Section eyebrow={intelligence.eyebrow} lede={intelligence.body} title={intelligence.title} />

      <Section
        eyebrow={integration.eyebrow}
        lede={integration.body}
        title={integration.title}
        tone="muted"
      >
        <TagList items={integration.tags} />
      </Section>

      <Section eyebrow={outcomes.eyebrow} title={outcomes.title}>
        <RoleGrid items={outcomes.items} />
      </Section>

      <Section eyebrow={proof.eyebrow} title={proof.title}>
        <ProofBlock body={proof.body} pending pendingNote={proof.pendingNote} />
      </Section>

      <Section eyebrow={faq.eyebrow} title={faq.title}>
        <FaqList items={faq.items} />
      </Section>

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        explore={{ label: cta.explore, href: useCasesHref }}
        title={cta.title}
      />
    </>
  );
}
