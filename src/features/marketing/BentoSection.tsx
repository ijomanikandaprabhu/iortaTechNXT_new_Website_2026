import { getTranslations } from "next-intl/server";
import { BentoGrid, type BentoItem } from "@/components/ui/BentoGrid";
import { productBrand } from "@/config/brand.config";
import { PRODUCTS, STANDALONE_PATHS, productPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { ICON_DIR, ICON_EXT, type CapabilitySlug } from "@/features/hero/capabilities";

/**
 * The six Verse products, paired with the capability icon that already
 * represents each one elsewhere on the page.
 *
 * `key` doubles as the product slug, so the cell's link is derived rather than
 * written out a second time. Both fields are unions drawn from the message
 * bundle and the icon set rather than plain strings, so a cell without a
 * translation, or pointing at an icon that does not exist, is a compile error
 * instead of a blank panel.
 */
type BentoKey = keyof IntlMessages["home"]["bento"]["items"];

const CELLS: Array<{ key: BentoKey; icon: CapabilitySlug }> = [
  { key: "salesverse", icon: "sales-distribution" },
  { key: "agentverse", icon: "customer-agent" },
  { key: "customerverse", icon: "communication-support" },
  { key: "merchantverse", icon: "digital-insurtech" },
  { key: "claimverse", icon: "claims-management" },
  { key: "brokerverse", icon: "insurance-categories" },
];

/**
 * Fifth band: the six Verse products as a bento grid.
 *
 * Cells now link to their product overview. They were plain panels while those
 * pages did not exist, since a grid of anchors all resolving to "/" is worse
 * than no links at all; `built` is still checked so the rule holds if a product
 * is ever added here before its page ships.
 */
export async function BentoSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.bento" });

  const items: BentoItem[] = CELLS.map(({ key, icon }) => {
    const product = PRODUCTS.find((entry) => entry.slug === key);
    const overview = getLocalizedPath(productPath(key), locale);
    const iconSrc = `${ICON_DIR}/${icon}.${ICON_EXT}`;
    const name = t(`items.${key}.title`);
    const tint = productBrand[key];

    return {
      title: name,
      body: t(`items.${key}.body`),
      icon: iconSrc,
      href: product?.built ? overview : undefined,
      tint,
      panel: {
        title: name,
        lede: t(`items.${key}.lede`),
        // `t.raw` because these are arrays, which the string translator cannot
        // return. The bundle is the source of the types, so the shape is checked.
        points: t.raw(`items.${key}.points`) as string[],
        features: t.raw(`items.${key}.features`) as { title: string; body: string }[],
        primary: { label: t("panelExplore", { name }), href: overview },
        secondary: {
          label: t("panelDemo"),
          // Arriving from a product card preselects that product on the form.
          href: `${getLocalizedPath(STANDALONE_PATHS.requestDemo, locale)}?product=${key}`,
        },
        more: [
          {
            label: t("panelFeatures"),
            body: t("moreBody"),
            href: getLocalizedPath(productPath(key, "features"), locale),
          },
          {
            label: t("panelUseCases"),
            body: t("moreBody"),
            href: getLocalizedPath(productPath(key, "use-cases"), locale),
          },
          {
            label: t("panelDemo"),
            body: t("moreBody"),
            href: `${getLocalizedPath(STANDALONE_PATHS.requestDemo, locale)}?product=${key}`,
          },
        ],
        quote: {
          badge: t("quote.badge"),
          text: t("quote.text"),
          name: t("quote.name"),
          org: t("quote.org"),
          cta: t("quote.cta"),
        },
        getStarted: {
          title: t("getStarted.title", { name }),
          primary: {
            label: t("getStarted.primary"),
            href: `${getLocalizedPath(STANDALONE_PATHS.requestDemo, locale)}?product=${key}`,
          },
          secondary: {
            label: t("getStarted.secondary"),
            href: getLocalizedPath("/contact", locale),
          },
        },
        icon: iconSrc,
        tint,
      },
    };
  });

  return (
    <section className="bentosec" aria-labelledby="bento-title">
      <div className="bentosec__inner">
        <p className="bentosec__eyebrow">{t("eyebrow")}</p>

        {/* Two tones across the two lines, keeping the device from the
            reference: the claim in full ink, the qualifier in --ink-soft. */}
        <h2 className="bentosec__title" id="bento-title">
          {t("titleLine1")}
          <br />
          <span className="bentosec__rest">{t("titleLine2")}</span>
        </h2>

        <p className="bentosec__sub">{t("sub")}</p>

        <p className="bentosec__note">
          {t("noteOne")} <span className="bentosec__rest">{t("noteTwo")}</span>
        </p>

        {/* Labels resolved here so the grid can stay a dumb client component
            without pulling the translator into it. */}
        <BentoGrid
          closeLabel={t("close")}
          items={items}
          moreTitle={t("moreTitle")}
          showLabel={t("showDetails")}
        />
      </div>
    </section>
  );
}
