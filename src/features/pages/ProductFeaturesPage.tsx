import { PageHero } from "@/components/sections/PageHero";
import {
  FeatureList,
  Prose,
  Section,
  TagList,
  type FeatureItem,
} from "@/components/sections/Section";
import { CtaBand } from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";
import { productPath } from "@/config/site.config";

/**
 * Product features page — the deepest page type in the site.
 *
 * Organized as numbered capability families rather than a flat feature list,
 * per the spec. Each group carries either term/description pairs or a body plus
 * chips, so integration and control surfaces do not have to be forced into the
 * same shape as functional capabilities.
 */
type FeatureGroup = {
  number: string;
  eyebrow: string;
  title: string;
  items?: FeatureItem[];
  body?: string;
  tags?: string[];
};

export async function ProductFeaturesPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = await getPageTranslations(locale, `products.${slug}.features`);

  const hero = t.raw("hero") as {
    eyebrow: string;
    title: string;
    lede: string;
    primary: string;
    secondary: string;
  };
  const note = t("note");
  const groups = t.raw("groups") as FeatureGroup[];
  const cta = t.raw("cta") as {
    title: string;
    convert: string;
    evaluate: string;
    explore: string;
  };

  const demoHref = getLocalizedPath("/contact", locale);
  const overviewHref = getLocalizedPath(productPath(slug), locale);
  const useCasesHref = getLocalizedPath(productPath(slug, "use-cases"), locale);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        lede={hero.lede}
        primary={{ label: hero.primary, href: demoHref }}
        secondary={{ label: hero.secondary, href: overviewHref }}
        title={hero.title}
      />

      {/* Scope caveat sits before the capability list, not buried under it. */}
      <Section>
        <Prose paragraphs={[note]} />
      </Section>

      {groups.map((group, index) => (
        <Section
          eyebrow={group.eyebrow}
          key={group.number}
          lede={group.body}
          number={group.number}
          title={group.title}
          // Alternating tint keeps sixteen possible capability families
          // distinguishable while scrolling.
          tone={index % 2 === 1 ? "muted" : undefined}
        >
          {group.items ? <FeatureList items={group.items} /> : null}
          {group.tags ? <TagList items={group.tags} /> : null}
        </Section>
      ))}

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        evaluate={{ label: cta.evaluate, href: overviewHref }}
        explore={{ label: cta.explore, href: useCasesHref }}
        title={cta.title}
      />
    </>
  );
}
