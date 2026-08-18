import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { PartnerCloud } from "./PartnerCloud";

/**
 * Client logo wall with a featured case-study card alongside it, following the
 * ramp.com layout: a wide logo grid with the card occupying the right edge
 * across both rows.
 *
 * Server component apart from the rotating grid inside PartnerCloud.
 */
export async function PartnersSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.partners" });

  return (
    <section className="partners" aria-labelledby="partners-title">
      <h2 className="partners__title" id="partners-title">
        {t("titleLead")} <span className="partners__accent">{t("titleAccent")}</span>
      </h2>

      <div className="partners__row">
        <PartnerCloud />

        <Link href={getLocalizedPath("/contact", locale)} className="casecard">
          {/* Placeholder art until a real case-study image exists. */}
          <span className="casecard__art" role="img" aria-label={t("featured.imageNote")} />

          <span className="casecard__body">
            <span className="casecard__brand">{t("featured.brand")}</span>
            <span className="casecard__stat u-tabular">{t("featured.stat")}</span>
            <span className="casecard__caption">{t("featured.caption")}</span>
          </span>

          <span className="casecard__arrow" aria-hidden="true">
            →
          </span>
          <span className="u-visually-hidden">{t("featured.cta")}</span>
        </Link>
      </div>
    </section>
  );
}
