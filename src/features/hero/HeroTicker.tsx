"use client";

import { useTranslations } from "next-intl";
import { PLACEHOLDER_DATA, TICKER_DURATION_S, TICKER_STATS } from "./ticker.config";

/**
 * Scrolling stats strip along the bottom of the opening block.
 *
 * The track is rendered twice and translated by exactly -50%, which is what
 * makes the loop seamless: as the first copy leaves, the second is already in
 * its place. Animation is CSS-only — a JS loop here would compete with the
 * frame sequence for the same frames.
 */
export function HeroTicker() {
  const t = useTranslations("home.intro");

  const track = (
    <div className="ticker__track" aria-hidden="true">
      {TICKER_STATS.map((stat) => (
        <span key={stat.key} className="ticker__item">
          <span className="ticker__name">{t(`ticker.${stat.key}`)}</span>
          <span className="ticker__value u-tabular">{stat.value}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker">
      <p className="ticker__label">
        {t("tickerLabel")}
        {PLACEHOLDER_DATA && process.env.NODE_ENV !== "production" && (
          <span className="ticker__sample">{t("tickerSample")}</span>
        )}
      </p>

      <div className="ticker__viewport">
        <div className="ticker__rail" style={{ animationDuration: `${TICKER_DURATION_S}s` }}>
          {track}
          {track}
        </div>
      </div>

      {/* One static, readable copy for assistive tech — the animated rail is
          duplicated and would otherwise be announced twice. */}
      <ul className="u-visually-hidden">
        {TICKER_STATS.map((stat) => (
          <li key={stat.key}>
            {t(`ticker.${stat.key}`)}: {stat.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
