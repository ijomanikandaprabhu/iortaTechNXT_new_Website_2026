"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";

/**
 * Six outcome cards, one per challenge, stacked vertically.
 *
 * Each card carries a small animated UI motif rather than a screenshot: the
 * products these describe are not built to a point where a real capture would
 * be honest, and an invented interface would read as one. The motifs are
 * abstract — channels converging, a journey filling, a claim advancing — so
 * they illustrate the shape of the work without claiming a specific screen.
 *
 * Motion runs once when a card scrolls into view. Everything animated is
 * transform, opacity or `pathLength`, so it stays on the compositor.
 *
 * On a wide screen the row is pinned and scrolls sideways: three cards are
 * visible at a time and vertical scrolling drives the track horizontally.
 * Below that the pin is dropped for an ordinary vertical stack, since three
 * cards abreast have nowhere to go on a narrow screen.
 */

/** Below this the pinned horizontal track is abandoned for a vertical stack. */
const HORIZONTAL_QUERY = "(min-width: 1024px)";

type CardKey = keyof IntlMessages["home"]["challenge"]["cards"];

const CARDS: { key: CardKey; Motif: () => JSX.Element }[] = [
  { key: "distribution", Motif: DistributionMotif },
  { key: "brokerage", Motif: BrokerageMotif },
  { key: "agents", Motif: AgentsMotif },
  { key: "customer", Motif: CustomerMotif },
  { key: "embedded", Motif: EmbeddedMotif },
  { key: "claims", Motif: ClaimsMotif },
];

/* ---------------------------------------------------------------- variants */

/** Slides in from the left, staggered by index. */
const slideIn = {
  rest: { opacity: 0, x: -12 },
  play: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.12 + i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

/** Draws a connector along its own path. */
const drawIn = {
  rest: { pathLength: 0, opacity: 0 },
  play: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.3 + i * 0.09, duration: 0.55, ease: "easeInOut" as const },
  }),
};

/** Scales up from the middle, for hubs and badges. */
const popIn = {
  rest: { opacity: 0, scale: 0.4 },
  play: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.5 + i * 0.08, duration: 0.45, ease: "backOut" as const },
  }),
};

/** Rises from below, for rows and list items. */
const riseIn = {
  rest: { opacity: 0, y: 10 },
  play: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.09, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* -------------------------------------------------------------------- cards */

export function ChallengeCards({
  locale,
  children,
}: {
  locale: Locale;
  /** The section heading, rendered inside the pin so it stays with the cards. */
  children?: React.ReactNode;
}) {
  const t = useTranslations("home.challenge.cards");
  const reduce = useReducedMotion();
  const horizontal = useHorizontal() && !reduce;

  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  /** How far the track has to travel to bring the last card into view. */
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !horizontal) {
      setTravel(0);
      return;
    }

    const measure = () => {
      // scrollWidth counts the columns overflowing the track's own box, so the
      // difference is exactly the distance still to be revealed.
      setTravel(Math.max(0, track.scrollWidth - track.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [horizontal]);

  /**
   * The pin is exactly one viewport tall, so the distance the wrapper scrolls
   * while pinned is exactly `travel`. That makes this progress map 1:1 onto the
   * horizontal movement without any correction factor.
   */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  const cards = CARDS.map(({ key, Motif }) => (
    <li className="chcards__item" key={key}>
      {/*
        The card's own entrance uses plain objects rather than named variants,
        so it cannot interfere with the rest/play names the motif shapes use.
      */}
      <m.article
        className="chcard"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        viewport={{ once: true, margin: "-12%" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="chcard__copy">
          <h3 className="chcard__title">{t(`${key}.title` as `${CardKey}.title`)}</h3>
          <p className="chcard__body">{t(`${key}.body` as `${CardKey}.body`)}</p>

          <Link className="chcard__cta" href={getLocalizedPath("/", locale)}>
            {t(`${key}.cta` as `${CardKey}.cta`)}
            <span className="chcard__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="chcard__visual" aria-hidden="true">
          <Motif />
        </div>
      </m.article>
    </li>
  ));

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        className="chscroll"
        data-mode={horizontal ? "horizontal" : "stacked"}
        ref={wrapRef}
        // One viewport for the pin, plus the sideways distance to cover.
        style={horizontal ? { height: `calc(100vh + ${travel}px)` } : undefined}
      >
        <div className="chscroll__pin">
          {children}

          <m.ul className="chcards" ref={trackRef} style={horizontal ? { x } : undefined}>
            {cards}
          </m.ul>
        </div>
      </div>
    </LazyMotion>
  );
}

/**
 * Null-safe media query hook. Starts false so the server render and the first
 * client render agree on the stacked layout; the pin swaps in after mount.
 */
function useHorizontal() {
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(HORIZONTAL_QUERY);
    const sync = () => setHorizontal(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return horizontal;
}

/* ------------------------------------------------------------------ motifs */

/**
 * The orchestrating parent for every motif.
 *
 * The trigger sits on the <svg> rather than being inherited from the card, so
 * each motif is self-contained: its shapes are the svg's own direct motion
 * children, and the card's entrance stays independent of them. That also means
 * a motif can be dropped anywhere without depending on what wraps it.
 */
function MotifFrame({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <m.svg
      className="chm"
      // Starting straight at "play" resolves every variant to its finished
      // state, so nothing moves and no second variant set is needed.
      initial={reduce ? "play" : "rest"}
      viewBox="0 0 240 144"
      viewport={{ once: true, margin: "-12%" }}
      whileInView="play"
    >
      {children}
    </m.svg>
  );
}

const ROWS = [24, 56, 88, 120];

/** Four channels converging into one core. */
function DistributionMotif() {
  return (
    <MotifFrame>
      {ROWS.map((y, i) => (
        <m.rect
          className="chm__chip"
          custom={i}
          height="20"
          key={`c${y}`}
          rx="10"
          variants={slideIn}
          width="66"
          x="6"
          y={y - 10}
        />
      ))}

      {ROWS.map((y, i) => (
        <m.path
          className="chm__wire"
          custom={i}
          d={`M74 ${y} C 116 ${y}, 140 72, 182 72`}
          key={`w${y}`}
          variants={drawIn}
        />
      ))}

      <m.circle className="chm__hub" custom={0} cx="200" cy="72" r="18" variants={popIn} />
      <circle className="chm__pulse" cx="200" cy="72" r="18" />
    </MotifFrame>
  );
}

/** A broker journey filling stage by stage. */
function BrokerageMotif() {
  const stops = [30, 82, 134, 186];

  return (
    <MotifFrame>
      <rect className="chm__track" height="6" rx="3" width="180" x="24" y="69" />
      <m.rect
        className="chm__fill"
        height="6"
        rx="3"
        style={{ transformOrigin: "24px 72px" }}
        variants={{
          rest: { scaleX: 0 },
          play: { scaleX: 1, transition: { delay: 0.2, duration: 0.9, ease: "easeInOut" } },
        }}
        width="180"
        x="24"
        y="69"
      />

      {stops.map((x, i) => (
        <m.circle className="chm__stop" custom={i} cx={x} cy="72" key={x} r="11" variants={popIn} />
      ))}

      {stops.map((x, i) => (
        <m.rect
          className="chm__label"
          custom={i}
          height="8"
          key={`l${x}`}
          rx="4"
          variants={riseIn}
          width="34"
          x={x - 17}
          y="98"
        />
      ))}
    </MotifFrame>
  );
}

/** A set of agent tools fanning out of a stack. */
function AgentsMotif() {
  const sheets = [
    { x: 40, y: 34, rotate: -8 },
    { x: 70, y: 44, rotate: 0 },
    { x: 100, y: 34, rotate: 8 },
  ];

  return (
    <MotifFrame>
      {sheets.map((s, i) => (
        <m.g
          key={i}
          style={{ originX: "50%", originY: "50%" }}
          variants={{
            rest: { opacity: 0, y: 16, rotate: 0 },
            play: {
              opacity: 1,
              y: 0,
              rotate: s.rotate,
              transition: { delay: 0.15 + i * 0.1, duration: 0.5, ease: "backOut" },
            },
          }}
        >
          <rect className="chm__sheet" height="76" rx="10" width="60" x={s.x} y={s.y} />
          <rect className="chm__line" height="6" rx="3" width="34" x={s.x + 13} y={s.y + 16} />
          <rect className="chm__line" height="6" rx="3" width="24" x={s.x + 13} y={s.y + 30} />
          <rect className="chm__linefaint" height="6" rx="3" width="30" x={s.x + 13} y={s.y + 44} />
        </m.g>
      ))}

      <m.circle className="chm__hub" custom={2} cx="196" cy="46" r="14" variants={popIn} />
    </MotifFrame>
  );
}

/** Scattered steps resolving into one clean flow. */
function CustomerMotif() {
  return (
    <MotifFrame>
      <m.rect
        className="chm__frame"
        custom={0}
        height="112"
        rx="14"
        variants={popIn}
        width="96"
        x="72"
        y="16"
      />

      {[36, 58, 80].map((y, i) => (
        <m.rect
          className="chm__line"
          custom={i}
          height="8"
          key={y}
          rx="4"
          variants={slideIn}
          width={i === 2 ? 40 : 62}
          x="89"
          y={y}
        />
      ))}

      <m.circle className="chm__tick" custom={3} cx="120" cy="112" r="13" variants={popIn} />
      <m.path className="chm__check" custom={4} d="M114 112 l4 4 l8 -8" variants={drawIn} />
    </MotifFrame>
  );
}

/** An insurance line slotting into a merchant checkout. */
function EmbeddedMotif() {
  return (
    <MotifFrame>
      <m.rect
        className="chm__frame"
        custom={0}
        height="108"
        rx="12"
        variants={popIn}
        width="164"
        x="38"
        y="18"
      />

      {[36, 58].map((y, i) => (
        <m.rect
          className="chm__line"
          custom={i}
          height="8"
          key={y}
          rx="4"
          variants={riseIn}
          width={i === 0 ? 78 : 58}
          x="54"
          y={y}
        />
      ))}

      {/* The inserted line: slides in from the right and stays accented. */}
      <m.g
        variants={{
          rest: { opacity: 0, x: 26 },
          play: { opacity: 1, x: 0, transition: { delay: 0.55, duration: 0.5, ease: "backOut" } },
        }}
      >
        <rect className="chm__slot" height="26" rx="8" width="132" x="54" y="76" />
        <rect className="chm__lineaccent" height="8" rx="4" width="66" x="64" y="85" />
      </m.g>
    </MotifFrame>
  );
}

/** A claim advancing from notification to settlement. */
function ClaimsMotif() {
  const stops = [36, 96, 156];

  return (
    <MotifFrame>
      <rect className="chm__track" height="6" rx="3" width="168" x="36" y="69" />
      <m.rect
        className="chm__fill"
        height="6"
        rx="3"
        style={{ transformOrigin: "36px 72px" }}
        variants={{
          rest: { scaleX: 0 },
          play: { scaleX: 1, transition: { delay: 0.25, duration: 1, ease: "easeInOut" } },
        }}
        width="168"
        x="36"
        y="69"
      />

      {stops.map((x, i) => (
        <m.circle className="chm__stop" custom={i} cx={x} cy="72" key={x} r="12" variants={popIn} />
      ))}

      <m.circle className="chm__tick" custom={3} cx="204" cy="72" r="16" variants={popIn} />
      <m.path className="chm__check" custom={4} d="M197 72 l5 5 l10 -11" variants={drawIn} />

      <m.rect
        className="chm__label"
        custom={4}
        height="8"
        rx="4"
        variants={riseIn}
        width="52"
        x="36"
        y="100"
      />
    </MotifFrame>
  );
}
