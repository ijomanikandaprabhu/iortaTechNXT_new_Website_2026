import { PageHero } from "@/components/sections/PageHero";
import {
  FeatureList,
  Prose,
  Section,
  TagList,
  bandTone,
  type FeatureItem,
} from "@/components/sections/Section";
import { CtaBand } from "@/components/sections/Blocks";
import Link from "next/link";
import type { Locale } from "@/core/i18n/config";
import { getPageTranslations } from "./translator";
import { getLocalizedPath } from "@/core/i18n/routing";
import { productPath } from "@/config/site.config";
import { productBrand } from "@/config/brand.config";

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
  /**
   * Optional: CustomerVerse and MerchantVerse Features describe functional
   * workflow only, and deliberately carry no automation or intelligence claim
   * until that capability is validated for those products.
   */
  const automation = t.has("automation") ? (t.raw("automation") as AutomationBlock) : null;
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
        secondary={{ label: hero.secondary, href: overviewHref }}
        title={hero.title}
        tint={tint}
      />

      {/* Scope caveat sits before the capability list, not buried under it. */}
      <Section tint={tint} tone={bandTone(0)}>
        <Prose paragraphs={[note]} />
      </Section>

      {groups.map((group, index) => (
        <Section
          eyebrow={group.eyebrow}
          key={group.number}
          lede={group.body}
          number={group.number}
          title={group.title}
          // +1 because the scope caveat above is the page's first band; the
          // shared rhythm then keeps sixteen possible capability families
          // distinguishable while scrolling.
          tone={bandTone(index + 1)}
          tint={tint}
        >
          {group.items ? <FeatureList items={group.items} /> : null}
          {group.tags ? <TagList items={group.tags} /> : null}
        </Section>
      ))}

      {automation ? (
        <Section
          eyebrow={automation.eyebrow}
          tint={tint}
          title={automation.title}
          tone={bandTone(groups.length + 1)}
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
      ) : null}

      <CtaBand
        convert={{ label: cta.convert, href: demoHref }}
        evaluate={{ label: cta.evaluate, href: overviewHref }}
        explore={{ label: cta.explore, href: useCasesHref }}
        title={cta.title}
        tint={tint}
      />
    </>
  );
}
