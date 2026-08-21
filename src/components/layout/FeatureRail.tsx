"use client";

import { useEffect, useRef, useState } from "react";
import { FeatureIcon } from "@/components/ui/FeatureIcon";

export type RailItem = { id: string; label: string };

/**
 * The "All features" rail beside the capability panels.
 *
 * It observes the panels by id rather than rendering them. The Features page is
 * the deepest page in the site — nine to fifteen groups of roughly seven items —
 * and moving that into a client component to get a highlight would take all of
 * it out of the server-rendered HTML.
 */
export function FeatureRail({ heading, items }: { heading: string; items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  /**
   * Set on click and held briefly. A click starts a smooth scroll that crosses
   * every panel in between, and the observer would light each one up on the way
   * past, so the rail flickers through the whole list before settling.
   */
  const claimed = useRef<{ id: string; until: number } | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLElement>(null);
  /**
   * The sticky strip's height, mirrored into state as well as onto a custom
   * property: the observer's band depends on it, and an effect cannot react to a
   * CSS variable changing.
   */
  const [railH, setRailH] = useState(0);

  useEffect(() => {
    const panels = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!panels.length) return;

    /**
     * The product bar is fixed over the top of the page, so a panel is "current"
     * once it clears that bar, not once it enters the viewport. The bottom inset
     * keeps the last panels from all qualifying at once near the end of the page.
     */
    const topInset = () => {
      const sub =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--subnav-h"),
        ) || 61;
      /**
       * On a phone the rail itself is a sticky strip below the product bar, and
       * it hides a panel's heading just as the bar does. Left out, the band
       * starts too high, the panel above still qualifies, and the highlight sits
       * one group behind what is actually being read.
       */
      return Math.round(sub + railH + 24);
    };

    let observer: IntersectionObserver;
    // `panels` is in document order, so the first match is the topmost.
    const inBand = new Map<string, boolean>();

    const build = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => inBand.set(e.target.id, e.isIntersecting));
          if (claimed.current && Date.now() < claimed.current.until) return;

          // Topmost panel currently past the bar wins, so the rail follows
          // reading order rather than whichever entry happened to fire last.
          const current = panels.filter((p) => inBand.get(p.id));
          if (current.length) {
            setActive(current[0].id);
            return;
          }

          /**
           * Nothing in the band. Above the first panel that means the reader has
           * not reached the list yet, so the rail resets to the top; below it
           * they are past the end (the automation block, the CTA), where holding
           * the last group is right. Without this the rail keeps whatever was
           * last highlighted, and scrolling back to the top leaves a group in
           * the middle of the list lit up.
           */
          const first = panels[0];
          if (first && window.scrollY + topInset() < first.offsetTop) {
            setActive(first.id);
          }
        },
        { rootMargin: `-${topInset()}px 0px -55% 0px`, threshold: 0 },
      );
      panels.forEach((p) => observer.observe(p));
    };

    build();
    // The bar's height changes when the announcement banner is dismissed, and
    // between the stacked and pinned layouts.
    window.addEventListener("resize", build);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", build);
    };
    // Rebuilt when the strip appears or changes height: the band is measured
    // from below it, and it does not exist yet on the first pass.
  }, [items, railH]);

  /**
   * Publishes the strip's height while it is the sticky chip bar, so an anchor
   * jump clears it as well as the product bar. Without this, tapping a chip
   * parks the panel's eyebrow behind the very strip that was tapped.
   *
   * Removed rather than zeroed on wide screens, where `.featrail` is the full
   * height of the panel column and would be a nonsense offset.
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 900px)");

    const publish = () => {
      if (mq.matches) {
        const h = Math.round(rail.getBoundingClientRect().height);
        root.style.setProperty("--featrail-h", `${h}px`);
        setRailH(h);
      } else {
        root.style.removeProperty("--featrail-h");
        setRailH(0);
      }
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(rail);
    mq.addEventListener("change", publish);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", publish);
      root.style.removeProperty("--featrail-h");
    };
  }, []);

  /**
   * Keeps the current chip in view once the rail is a horizontal strip.
   *
   * Deliberately not `scrollIntoView`: that walks up the ancestor chain and
   * scrolls the page as well, which fights the scroll the reader is already
   * making. This moves the strip's own scroll offset and nothing else.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Not a strip on wide screens, where the rail is a vertical column.
    if (list.scrollWidth <= list.clientWidth) return;

    const chip = list.querySelector<HTMLElement>(`[href="#${CSS.escape(active)}"]`);
    if (!chip) return;

    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    /**
     * Aligned to the start, not centred. The longest labels are wider than the
     * strip ("Performance, incentives & management intelligence"), and centring
     * one pushes its beginning off the left edge — you get the middle of a
     * sentence and no icon. The opening words are what identify it, so the chip
     * always starts where the reader looks first.
     *
     * CSS scroll-snap is deliberately not used alongside this: it re-snapped to
     * the nearest chip boundary after each programmatic scroll and pulled long
     * chips a few pixels off the edge, so the two mechanisms fought each other.
     */
    const padStart = Number.parseFloat(getComputedStyle(list).paddingLeft) || 0;
    const delta = chipRect.left - listRect.left - padStart;
    if (Math.abs(delta) < 2) return;

    /**
     * Instant when the change came from tapping a chip.
     *
     * That tap also starts the page's own smooth scroll to the anchor, and the
     * browser cancels an in-flight programmatic smooth scroll as soon as another
     * one begins — so the strip simply never moved, leaving the chip that was
     * just tapped somewhere off-screen. An instant adjustment cannot be
     * cancelled, and is invisible anyway while the page is animating.
     */
    const fromTap = claimed.current !== null && Date.now() < claimed.current.until;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: delta, behavior: fromTap || reduced ? "auto" : "smooth" });
  }, [active]);

  return (
    <aside className="featrail" ref={railRef}>
      <div className="featrail__inner">
        <p className="featrail__heading">{heading}</p>
        <nav aria-label={heading}>
          <ol className="featrail__list" ref={listRef}>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  aria-current={active === item.id ? "true" : undefined}
                  className={`featrail__link ${
                    active === item.id ? "featrail__link--active" : ""
                  }`.trim()}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActive(item.id);
                    claimed.current = { id: item.id, until: Date.now() + 700 };
                  }}
                >
                  <FeatureIcon label={item.label} />
                  <span className="featrail__text">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
