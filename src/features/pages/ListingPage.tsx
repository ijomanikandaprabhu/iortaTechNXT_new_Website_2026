import { PageHero } from "@/components/sections/PageHero";
import { Prose, Section, bandTone } from "@/components/sections/Section";
import { CardGrid, FilterList, type CardItem } from "@/components/sections/Cards";
import { CtaBand } from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { getPageTranslations } from "./translator";

/**
 * Insights, News & Events and Customer Stories.
 *
 * All three are "a hero, optional filters, one or more groups of cards, then a
 * CTA". They differ in what the cards carry, which is content rather than
 * layout, so they share one template.
 *
 * Every card group is driven from the message bundle. When a CMS or article
 * collection is introduced, only the data source changes.
 */

type Hero = { eyebrow: string; title: string; lede?: string; primary?: string; secondary?: string };
type Filters = { label: string; items: string[] };
/**
 * `items` is optional: several groups are prose only. News & Events currently
 * has no published announcements or confirmed events at all, and both listings
 * end with a "how we publish" group that is explanation rather than cards.
 */
type Group = { eyebrow?: string; title?: string; body?: string[]; items?: CardItem[] };
type Cta = { title: string; convert?: string; evaluate?: string; explore?: string };

export async function ListingPage({
  locale,
  namespace,
  primaryHref,
  secondaryHref,
  ctaHrefs,
}: {
  locale: Locale;
  namespace: string;
  primaryHref: string;
  secondaryHref?: string;
  ctaHrefs: { convert: string; evaluate?: string; explore?: string };
}) {
  const t = await getPageTranslations(locale, namespace);

  const hero = t.raw("hero") as Hero;
  const filters = t.has("filters") ? (t.raw("filters") as Filters) : null;
  const groups = (t.raw("groups") ?? []) as Group[];
  const cta = t.has("cta") ? (t.raw("cta") as Cta) : null;

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
      />

      {filters ? (
        <Section tone={bandTone(0)}>
          <FilterList items={filters.items} label={filters.label} />
        </Section>
      ) : null}

      {groups.map((group, index) => (
        <Section
          eyebrow={group.eyebrow}
          key={group.eyebrow ?? group.title}
          lede={group.title && group.body?.length === 1 ? group.body[0] : undefined}
          title={group.title}
          // Offset past the filter bar when this listing has one, so the
          // rhythm counts every band on the page rather than restarting.
          tone={bandTone(index + (filters ? 1 : 0))}
        >
          {group.body && group.body.length > 1 ? <Prose paragraphs={group.body} /> : null}
          {group.items?.length ? <CardGrid items={group.items} /> : null}
        </Section>
      ))}

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
          title={cta.title}
        />
      ) : null}

      <span className="u-visually-hidden">
        <a href={getLocalizedPath("/", locale)}>Home</a>
      </span>
    </>
  );
}
