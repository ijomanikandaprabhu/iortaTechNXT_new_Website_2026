import { PageHero } from "@/components/sections/PageHero";
import {
  FeatureList,
  JourneySteps,
  Prose,
  Section,
  TagList,
  bandTone,
  type FeatureItem,
  type SectionTint,
} from "@/components/sections/Section";
import {
  CtaBand,
  ProofBlock,
  RelatedLinks,
  RoleGrid,
  type RelatedItem,
  type RoleItem,
} from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";

/**
 * The renderer behind Solutions, Industries and Capabilities pages (and
 * Technology, once those pages exist).
 *
 * Those three page types share one skeleton — hero, a run of numbered
 * sections, optional proof and related reading, then the CTA band — and differ
 * in which section shapes they use and what they say. The spec asks for page
 * types that do not feel templated; that distinction lives in the content and
 * in which blocks each section switches on, not in duplicated layout code.
 *
 * Product pages have genuinely different skeletons and get their own templates.
 */

export type ContentSection = {
  number?: string;
  eyebrow?: string;
  title?: string;
  /** Paragraphs of body copy. */
  body?: string[];
  /** Term/description pairs. */
  features?: FeatureItem[];
  /** Chips — the spec's comma-separated capability runs. */
  tags?: string[];
  /** Role/outcome pairs. */
  roles?: RoleItem[];
  /** A linear journey. */
  steps?: string[];
  /**
   * Closing line, rendered after every other block. The spec ends most
   * automation sections with a governance statement ("underwriting judgement
   * remains with the appropriate authority") that has to sit *after* the
   * capability list — which `body` cannot do, since it renders above.
   */
  note?: string;
};

type Hero = {
  eyebrow: string;
  title: string;
  lede?: string;
  primary?: string;
  secondary?: string;
};

type Proof = {
  eyebrow: string;
  title: string;
  body: string;
  pending?: string;
  pendingNote?: string;
};

type Related = { eyebrow: string; title: string; items: RelatedItem[] };

type Cta = { title: string; convert?: string; evaluate?: string; explore?: string };

export async function ContentPage({
  locale,
  namespace,
  primaryHref,
  secondaryHref,
  ctaHrefs,
  tint,
}: {
  locale: Locale;
  /**
   * Dotted message namespace for this page, e.g. `solutions.core-modernization`.
   * Callers build it from a slug that has already been checked against the
   * registry, so an unknown page 404s before it reaches here.
   */
  namespace: string;
  primaryHref: string;
  secondaryHref?: string;
  ctaHrefs: { convert: string; evaluate?: string; explore?: string };
  /**
   * Product brand palette. Only product-owned pages pass this; solutions,
   * industries and the rest stay on the neutral palette.
   */
  tint?: SectionTint;
}) {
  // next-intl types `namespace` as a union of literal message paths. These are
  // assembled from registry slugs at runtime, so the literal type is not
  // available here; the route guarantees the namespace exists.
  const t = await getPageTranslations(locale, namespace);

  const hero = t.raw("hero") as Hero;
  const sections = (t.raw("sections") ?? []) as ContentSection[];
  const proof = t.has("proof") ? (t.raw("proof") as Proof) : null;
  const related = t.has("related") ? (t.raw("related") as Related) : null;
  // Optional: legal and policy pages deliberately end without a sales CTA.
  const cta = t.has("cta") ? (t.raw("cta") as Cta) : null;

  const home = getLocalizedPath("/", locale);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        lede={hero.lede}
        primary={hero.primary ? { label: hero.primary, href: primaryHref } : undefined}
        secondary={
          hero.secondary && secondaryHref
            ? { label: hero.secondary, href: secondaryHref }
            : undefined
        }
        title={hero.title}
        tint={tint}
      />

      {sections.map((section, index) => {
        /**
         * A lone paragraph reads better as the section's lede than as a
         * one-line Prose block — but only when there is a title for it to sit
         * under. Without that check an untitled single-paragraph section
         * rendered as neither, and its copy silently disappeared.
         */
        const bodyAsLede = Boolean(section.title) && section.body?.length === 1;

        return (
        <Section
          eyebrow={section.eyebrow}
          key={section.eyebrow ?? section.title}
          lede={bodyAsLede ? section.body![0] : undefined}
          number={section.number}
          title={section.title}
          tint={tint}
          tone={bandTone(index)}
        >
          {section.body && !bodyAsLede ? <Prose paragraphs={section.body} /> : null}
          {section.steps ? <JourneySteps steps={section.steps} /> : null}
          {section.features ? <FeatureList items={section.features} /> : null}
          {section.roles ? <RoleGrid items={section.roles} /> : null}
          {section.tags ? <TagList items={section.tags} /> : null}
          {section.note ? <p className="sec__note">{section.note}</p> : null}
        </Section>
        );
      })}

      {/* The rhythm runs continuously across every band on the page, so these
          two pick up where the mapped sections left off rather than restarting. */}
      {proof ? (
        <Section
          eyebrow={proof.eyebrow}
          tint={tint}
          title={proof.title}
          tone={bandTone(sections.length)}
        >
          <ProofBlock
            body={proof.body}
            pending={Boolean(proof.pending)}
            pendingNote={proof.pendingNote}
          />
        </Section>
      ) : null}

      {related ? (
        <Section
          eyebrow={related.eyebrow}
          tint={tint}
          title={related.title}
          tone={bandTone(sections.length + (proof ? 1 : 0))}
        >
          <RelatedLinks items={related.items} />
        </Section>
      ) : null}

      {cta ? (
        <CtaBand
          convert={cta.convert ? { label: cta.convert, href: ctaHrefs.convert } : undefined}
          evaluate={
            cta.evaluate && ctaHrefs.evaluate
              ? { label: cta.evaluate, href: ctaHrefs.evaluate }
              : undefined
          }
          explore={
            cta.explore && ctaHrefs.explore
              ? { label: cta.explore, href: ctaHrefs.explore }
              : undefined
          }
          tint={tint}
          title={cta.title}
        />
      ) : null}

      {/* Keeps the page reachable back to the site root for crawlers even when
          the related links above are still unbuilt. */}
      <span className="u-visually-hidden">
        <a href={home}>Home</a>
      </span>
    </>
  );
}
