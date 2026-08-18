import { getTranslations } from "next-intl/server";
import { BentoGrid, type BentoItem } from "@/components/ui/BentoGrid";
import type { Locale } from "@/core/i18n/config";
import { ICON_DIR, ICON_EXT, type CapabilitySlug } from "@/features/hero/capabilities";

/**
 * The six domains, paired with the capability icon that already represents each
 * one elsewhere on the page.
 *
 * Both fields are unions drawn from the message bundle and the icon set rather
 * than plain strings, so a cell without a translation, or pointing at an icon
 * that does not exist, is a compile error instead of a blank panel.
 */
type BentoKey = keyof IntlMessages["home"]["bento"]["items"];

const CELLS: Array<{ key: BentoKey; icon: CapabilitySlug }> = [
  { key: "core", icon: "core-insurance" },
  { key: "distribution", icon: "sales-distribution" },
  { key: "journeys", icon: "customer-agent" },
  { key: "claims", icon: "claims-management" },
  { key: "payments", icon: "payments-finance" },
  { key: "data", icon: "data-analytics" },
];

/**
 * Fifth band: the platform's six domains as a bento grid.
 *
 * Cells are not links. The pages they would point at do not exist yet, and a
 * grid of anchors that all resolve to "/" is worse than plain panels.
 */
export async function BentoSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.bento" });

  const items: BentoItem[] = CELLS.map(({ key, icon }) => ({
    title: t(`items.${key}.title`),
    body: t(`items.${key}.body`),
    detail: t(`items.${key}.detail`),
    icon: `${ICON_DIR}/${icon}.${ICON_EXT}`,
  }));

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
        <BentoGrid hideLabel={t("hideDetails")} items={items} showLabel={t("showDetails")} />
      </div>
    </section>
  );
}
