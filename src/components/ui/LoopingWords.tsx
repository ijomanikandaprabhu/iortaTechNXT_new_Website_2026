"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

/**
 * Vertical word loop with a bracket selector that resizes to the current word.
 *
 * Adapted from the Osmo GSAP resource (https://www.osmo.supply/). The upstream
 * version assumed Tailwind and a five-word list; this one uses the project's
 * CSS classes and works for any list of two or more.
 *
 * Three things changed for correctness rather than style:
 *
 * 1. The index lives in a ref. Upstream held it in a `let` in the component
 *    body, which resets on every render and is captured stale by the
 *    `useCallback`s — the loop drifts as soon as the component re-renders.
 * 2. The loop rotates after every step instead of when `index >= words - 3`.
 *    That threshold was tuned for a five-word list; at three words it is true
 *    immediately and the sequence never advances cleanly.
 * 3. Reduced motion holds the first word instead of animating.
 */
type LoopingWordsProps = {
  words: string[];
  /** Pause on each word once it has settled, in ms. */
  holdMs?: number;
  className?: string;
};

const TRAVEL_S = 1.2;

export function LoopingWords({ words, holdMs = 2000, className }: LoopingWordsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Joined rather than the array itself: a literal prop is a new array on every
  // parent render, which would tear down and rebuild the timeline each time.
  const wordsKey = words.join("|");

  useEffect(() => {
    const list = listRef.current;
    const selector = selectorRef.current;
    if (!list || !selector) return;

    const count = list.children.length;
    if (count < 2) return;

    /** One item as a percentage of the whole stacked list. */
    const step = 100 / count;

    /**
     * Sizes the bracket to a word. Measures the inner span, not the <li> —
     * the item is full width, so the list item's own box says nothing about
     * how wide the text is.
     */
    const fitSelector = (index: number, animate: boolean) => {
      const item = list.children[index] as HTMLElement | undefined;
      const text = item?.firstElementChild as HTMLElement | null;
      if (!text) return;

      const pct = (text.getBoundingClientRect().width / list.getBoundingClientRect().width) * 100;
      const to = { width: `${pct}%` };

      if (animate) gsap.to(selector, { ...to, duration: 0.5, ease: "expo.out" });
      else gsap.set(selector, to);
    };

    // The settled word is always the first child — see the rotate below.
    fitSelector(0, false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const advance = () => {
      gsap.to(list, {
        yPercent: -step,
        duration: TRAVEL_S,
        ease: "elastic.out(1, 0.85)",
        // The incoming word is the one below, so the bracket resizes while it
        // travels rather than snapping once it lands.
        onStart: () => fitSelector(1, true),
        onComplete: () => {
          // Move the spent word to the back and snap home. The list is then
          // exactly where it started with the next word on top, so this runs
          // forever without accumulating offset.
          list.appendChild(list.children[0]!);
          gsap.set(list, { yPercent: 0 });
        },
      });
    };

    const timeline = gsap
      .timeline({ repeat: -1, delay: 1 })
      .call(advance)
      // Covers the travel as well, so `holdMs` is the still time on a word
      // rather than the whole cycle.
      .to({}, { duration: TRAVEL_S + holdMs / 1000 });

    const onResize = () => fitSelector(0, false);
    window.addEventListener("resize", onResize);

    return () => {
      timeline.kill();
      gsap.killTweensOf([list, selector]);
      window.removeEventListener("resize", onResize);
    };
  }, [wordsKey, holdMs]);

  return (
    <div className={cn("lw__words", className)}>
      <div className="lw__viewport">
        <ul className="lw__list" ref={listRef}>
          {words.map((word) => (
            <li className="lw__item" key={word}>
              <span className="lw__word">{word}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feathers the words as they enter and leave the slot. */}
      <div className="lw__fade" aria-hidden="true" />

      <div className="lw__selector" ref={selectorRef} aria-hidden="true">
        <span className="lw__edge" />
        <span className="lw__edge lw__edge--tr" />
        <span className="lw__edge lw__edge--bl" />
        <span className="lw__edge lw__edge--br" />
      </div>
    </div>
  );
}
