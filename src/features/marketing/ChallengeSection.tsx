import { getTranslations } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { ChallengeCards } from "./ChallengeCards";

/**
 * Centred opening — eyebrow, one question as the headline, a two-line answer —
 * followed by six outcome cards.
 *
 * The heading is server-rendered; only the cards need to be a client island,
 * since they animate as they scroll into view.
 */
export async function ChallengeSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.challenge" });

  return (
    <section className="challenge" aria-labelledby="challenge-title">
      {/*
        The heading is passed into the client island rather than sitting above
        it, so that while the card track is pinned the two stay centred in the
        viewport as one block. Left outside, the pin's full viewport height
        opened a large empty gap between the heading and the cards.
      */}
      <ChallengeCards locale={locale}>
        <div className="challenge__inner">
          <p className="challenge__eyebrow">{t("eyebrow")}</p>

          <h2 className="challenge__headline" id="challenge-title">
            {t("headline")}
          </h2>

          <p className="challenge__sub">
            {t("subLine1")}
            <br />
            {t("subLine2")}
          </p>
        </div>
      </ChallengeCards>
    </section>
  );
}
