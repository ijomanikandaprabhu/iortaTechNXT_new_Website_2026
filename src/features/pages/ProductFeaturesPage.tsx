import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureRail, type RailItem } from "@/components/layout/FeatureRail";
import {
  FeatureList,
  Prose,
  Section,
  TagList,
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
 *
 * The families sit beside a sticky rail rather than running down the page as
 * bands. With up to fifteen of them there was no way to see what the page
 * covered, or to reach the twelfth without scrolling past eleven others. The
 * alternating band rhythm is deliberately not used here: a sticky rail needs one
 * stable ground to sit against, and full-bleed dark bands fight a two-column
 * layout. Every other page type keeps the rhythm.
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

/** Group numbers are "01".."15" and unique within a page, so they make stable
 *  anchor targets without slugifying a label that may be translated. */
const panelId = (number: string) => `feature-${number}`;

export async function ProductFeaturesPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = await getPageTranslations(locale, `products.${slug}.features`);
  const tNav = await getTranslations({ locale, namespace: "nav" });

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

  const railItems: RailItem[] = groups.map((group) => ({
    id: panelId(group.number),
    label: group.eyebrow,
  }));

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
      <Section tint={tint}>
        <Prose paragraphs={[note]} />
      </Section>

      {/* The palette is set here rather than inherited: this region sits outside
          any `Section`, which is what normally carries the `--product-*` values. */}
      <div
        className="featlayout"
        style={
          {
            "--product-primary": tint.primary,
            "--product-primary-strong": tint.primaryStrong,
            "--product-supporting": tint.supporting,
            "--product-dark": tint.dark,
          } as React.CSSProperties
        }
      >
        <FeatureRail heading={tNav("allFeatures")} items={railItems} />

        <div className="featpanels">
          {groups.map((group) => (
            <section className="featpanel" id={panelId(group.number)} key={group.number}>
              <p className="featpanel__eyebrow">{group.eyebrow}</p>
              <h2 className="featpanel__title">{group.title}</h2>
              {group.body ? <p className="featpanel__lede">{group.body}</p> : null}
              {group.items ? <FeatureList items={group.items} /> : null}
              {group.tags ? <TagList items={group.tags} /> : null}
            </section>
          ))}
        </div>
      </div>

      {automation ? (
        <Section
          eyebrow={automation.eyebrow}
          tint={tint}
          title={automation.title}
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
