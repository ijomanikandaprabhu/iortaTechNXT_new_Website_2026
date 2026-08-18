"use client";

import { useEffect, useState } from "react";
import { LogoCloud } from "@/components/ui/LogoCloud";
import {
  PARTNER_INTERVAL_MS,
  PARTNER_LOGOS,
  PARTNER_SWAP_PER_TICK,
  PARTNER_VISIBLE,
  type PartnerLogo,
} from "./partners.config";

/** Fisher–Yates. Returns a new array; never mutates the source. */
function shuffled<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Logo grid that reshuffles on an interval.
 *
 * Only a couple of cells change per tick, deliberately. Swapping all eight at
 * once remounts every cell simultaneously, so the whole panel blanks and fades
 * back in — it reads as a flash rather than a shuffle. Rotating a few keeps the
 * panel stable while still cycling the full client list.
 *
 * The queue is consumed in shuffled order rather than picking at random each
 * time, so every client appears before any repeats.
 *
 * First render is plain file order: shuffling during render would produce
 * different markup on server and client and trip hydration.
 */
export function PartnerCloud() {
  const [slots, setSlots] = useState<PartnerLogo[]>(() =>
    PARTNER_LOGOS.slice(0, PARTNER_VISIBLE),
  );

  useEffect(() => {
    let queue = shuffled(PARTNER_LOGOS);
    let cursor = 0;

    // Start from a shuffled set rather than the SSR file order.
    setSlots(queue.slice(0, PARTNER_VISIBLE));
    cursor = PARTNER_VISIBLE;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const next = (onScreen: PartnerLogo[]): PartnerLogo => {
      // Walk the queue for the next logo that is not already on screen,
      // reshuffling when it runs out. Bounded so it can never spin.
      for (let attempts = 0; attempts < queue.length + 1; attempts++) {
        if (cursor >= queue.length) {
          queue = shuffled(PARTNER_LOGOS);
          cursor = 0;
        }
        const candidate = queue[cursor++]!;
        if (!onScreen.some((l) => l.src === candidate.src)) return candidate;
      }
      return queue[0]!;
    };

    const id = setInterval(() => {
      // Nothing to see on a hidden tab, and swapping there is actively worse:
      // the browser freezes CSS animations, so a cell that remounts while
      // hidden sits on the fade's opening frame at opacity 0 until the tab is
      // looked at again. Skipping the tick avoids that state entirely.
      if (document.hidden) return;

      setSlots((current) => {
        const updated = current.slice();
        const picked = new Set<number>();
        for (let i = 0; i < PARTNER_SWAP_PER_TICK; i++) {
          let slot = Math.floor(Math.random() * PARTNER_VISIBLE);
          // Do not replace the same cell twice in one tick.
          let guard = 0;
          while (picked.has(slot) && guard++ < PARTNER_VISIBLE) {
            slot = (slot + 1) % PARTNER_VISIBLE;
          }
          picked.add(slot);
          updated[slot] = next(updated);
        }
        return updated;
      });
    }, PARTNER_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <LogoCloud logos={slots} className="partners__logos" aria-hidden="true" />

      {/* The rotating grid is decorative duplication; this is the real,
          complete list for assistive tech and crawlers. */}
      <ul className="u-visually-hidden">
        {PARTNER_LOGOS.map((logo) => (
          <li key={logo.src}>{logo.alt}</li>
        ))}
      </ul>
    </>
  );
}
