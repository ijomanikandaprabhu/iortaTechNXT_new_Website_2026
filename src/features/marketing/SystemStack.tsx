"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/**
 * Stacking comparison cards, matched to the reference recording.
 *
 * The stack itself is `position: sticky` with a per-card offset: each card
 * pins a row lower than the last, so a card rides up and covers the previous
 * one while that card's tab stays visible. The tabs accumulate into rows, like
 * folder tabs in a drawer.
 *
 * The depth effect on top of that — a card shrinking as it gets buried — is the
 * one part that needs scroll position, so this is a client component. It is a
 * single rAF-throttled listener writing one custom property per card; the
 * shrink itself is a CSS `scale`, which stays on the compositor.
 */

/**
 * Order is the stacking order; the tab column cycles so tabs never collide.
 * `placeholders` is how many placeholder tiles that card's body holds — real
 * content per stage (Discover, Distribute, Engage, Service, Claim, Grow) is
 * not built yet, so each card shows an empty tile per item it will eventually
 * contain rather than prose that doesn't exist.
 */
const CARDS = [
  { key: "policy", placeholders: 1 },
  { key: "distribution", placeholders: 4 },
  { key: "claims", placeholders: 1 },
  { key: "payments", placeholders: 3 },
  { key: "reporting", placeholders: 1 },
  { key: "spreadsheets", placeholders: 1 },
] as const;

type CardKey = (typeof CARDS)[number]["key"];

/** How far a fully buried card shrinks. 1 = no shrink, 0.93 = 7% smaller. */
const MIN_SCALE = 0.93;

export function SystemStack() {
  const t = useTranslations("home.stack");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>(".sysstack__card"));
    if (cards.length < 2) return;

    let frame = 0;

    const settle = () => {
      frame = 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]!;

        // The last card is never covered, so it never shrinks — it is the one
        // the reader ends on and it should sit at full size.
        if (i === cards.length - 1) {
          card.style.setProperty("--depth", "0");
          continue;
        }

        /**
         * How far the next card has come over this one, 0 to 1.
         *
         * Measured against this card's pinned offset rather than its live top:
         * once pinned they are the same, and before pinning the ratio is well
         * over 1 and clamps to 0 anyway. Reading the CSS offset avoids asking
         * the element where it is while we are also moving it.
         */
        const pinTop = parseFloat(getComputedStyle(card).top) || 0;
        const nextTop = cards[i + 1]!.getBoundingClientRect().top;
        const height = card.offsetHeight || 1;

        const covered = Math.min(1, Math.max(0, 1 - (nextTop - pinTop) / height));
        card.style.setProperty("--depth", covered.toFixed(3));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(settle);
    };

    settle();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="sysstack" aria-labelledby="sysstack-title">
      <div className="sysstack__inner" style={{ "--min-scale": MIN_SCALE } as React.CSSProperties}>
        {/* Holds position while the cards scroll past it. */}
        <div className="sysstack__lead">
          <p className="sysstack__eyebrow">{t("eyebrow")}</p>

          {/* Two-tone, matching the bento section's device: the first line
              carries full ink, the second continues at --ink-soft, so the pair
              reads as one statement instead of a title with a caption. */}
          <h2 className="sysstack__headline" id="sysstack-title">
            {t("headlineLine1")}
            <br />
            <span className="sysstack__headlinerest">{t("headlineLine2")}</span>
          </h2>
        </div>

        <ol className="sysstack__cards" ref={listRef}>
          {CARDS.map(({ key, placeholders }, index) => (
            <li
              className="sysstack__card"
              key={key}
              style={
                {
                  /**
                   * Tabs wrap after a fixed number of columns, and a card only
                   * drops a row once its tab starts a new one — so the pin
                   * offset follows the tab row, not the card index. Measured
                   * off the reference: three tabs share the first row.
                   *
                   * Both a three-column and a two-column set are supplied and
                   * the stylesheet picks one, because the column count changes
                   * at the mobile breakpoint and CSS cannot take a modulo
                   * portably enough to derive it from the index alone.
                   */
                  "--col-3": index % 3,
                  "--row-3": Math.floor(index / 3),
                  "--col-2": index % 2,
                  "--row-2": Math.floor(index / 2),
                  "--i": index,
                } as React.CSSProperties
              }
            >
              <p className="sysstack__tab">{t(`cards.${key}.tab` as `cards.${CardKey}.tab`)}</p>

              {/*
                One tile per item this stage will eventually hold — Discover
                and Engage are single moments, Distribute has four channels,
                Service three request types, and so on. `data-count` styles
                the grid per size rather than needing a class per card.
              */}
              <div className="sysstack__body" data-count={placeholders}>
                {Array.from({ length: placeholders }, (_, tileIndex) => (
                  <div className="sysstack__placeholder" key={tileIndex}>
                    <span className="sysstack__placeholdertext">{t("placeholder")}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
