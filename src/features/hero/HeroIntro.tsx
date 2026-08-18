"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { HeroTicker } from "./HeroTicker";
import { SlideGlowButton } from "@/components/ui/SlideGlowButton";
import TextLoop from "@/components/ui/TextLoop";
import { ROTATE_KEYS } from "./RotatingWord";
import { SkyDots } from "./SkyDots";

/**
 * Opening block, laid over the sky frames at the top of the sequence:
 * eyebrow, headline, two supporting paragraphs, two text CTAs, and a panel
 * reserved for the product film.
 *
 * Purely presentational — visibility is driven by HeroSequence, which writes
 * opacity straight to the root each frame.
 */
export function HeroIntro() {
  const t = useTranslations("home.intro");
  const locale = useLocale() as Locale;

  // NOTE: no products page exists yet — this points home until one ships.
  const productsHref = getLocalizedPath("/", locale);
  const contactHref = getLocalizedPath("/contact", locale);

  return (
    <div className="intro">
      {/* Drifts with the pointer. Sits above the sky, below the copy. */}
      <SkyDots />

      <div className="intro__inner">
        <p className="intro__eyebrow">{t("eyebrow")}</p>

        {/* The animated phrase is aria-hidden inside TextLoop; ariaLabel keeps
            the heading readable as one sentence. */}
        <h1 className="intro__title">
          <TextLoop
            className="intro__loop"
            staticText={t("titlePrefix")}
            rotatingTexts={ROTATE_KEYS.map((key) => t(`rotate.${key}`))}
            ariaLabel={`${t("titlePrefix")} ${t(`rotate.${ROTATE_KEYS[0]}`)}`}
            // 4s dwell with a 0.45s reveal: the phrase is legible for ~78% of
            // each cycle. At 2.6s/0.7s it was closer to 46%, so the line sat
            // half-empty while the long phrases travelled.
            interval={4000}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </h1>

        <p className="intro__lead">{t("lead")}</p>
        <p className="intro__sub">{t("sub")}</p>

        <p className="intro__ctas">
          <Link href={productsHref} className="btn btn--primary btn--compact intro__cta">
            {t("ctaProducts")}
            <span className="intro__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          {/* Deliberately not a .btn: this one carries its own treatment. The
              arrow is dropped with it — the wipe is the hover affordance. */}
          <SlideGlowButton href={contactHref}>{t("ctaContact")}</SlideGlowButton>
        </p>

        {/* Video slot — replace the inner div with a <video> when the film is
            ready. Ratio is fixed so the layout does not shift. */}
        <div className="intro__panel">
          <div className="intro__videoslot" role="img" aria-label={t("videoPlaceholder")}>
            <span className="intro__slotlabel">{t("videoPlaceholder")}</span>
            <span className="intro__slothint">{t("videoHint")}</span>
          </div>
        </div>
      </div>

      <HeroTicker />
    </div>
  );
}
