"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SectionTint } from "@/components/sections/Section";
import { stripLocale } from "@/core/i18n/routing";

export type SubNavItem = { label: string; href: string };

/** Dead zone either side of the pin threshold, in pixels. */
const HYSTERESIS = 8;

/** Matches the transform transition in `subnav.css`. */
const PIN_MS = 320;

/**
 * Below this width the bar splits in two: the product identity stays at the top
 * and still takes over from the header on scroll, while the sections and the CTA
 * move to a dock at the bottom of the viewport, within thumb reach. Kept in sync
 * with the `max-width: 768px` block in `subnav.css`.
 */
const COMPACT_QUERY = "(max-width: 768px)";

type Props = {
  /** Shown beside the placeholder mark, e.g. "SalesVerse". */
  productName: string;
  /**
   * The product's Overview. It is the product name's link rather than a nav
   * item, so this is passed explicitly instead of being read off `items`.
   */
  home: string;
  items: SubNavItem[];
  demo: SubNavItem;
  /** Accessible names for the sections sheet toggle. */
  labels?: { menu: string; close: string };
  tint: SectionTint;
};

/**
 * Placeholder standing in for a per-product mark.
 *
 * Deliberately neutral: the products have no individual logos yet, and inventing
 * six is a design decision that has not been made. Sized and positioned like the
 * real mark would be, so swapping it in later is a one-component change.
 */
function ProductGlyph() {
  return (
    <span className="subnav__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Falls back rather than throwing. These two strings are only ever read for the
 * sections toggle's accessible name; a missing `labels` prop taking down the
 * whole product layout with a 500 is a far worse failure than an untranslated
 * label, and every product route renders through here.
 */
const FALLBACK_LABELS = { menu: "Open menu", close: "Close menu" };

/**
 * The per-product bar.
 *
 * It sits under the main header and rises to the top edge once that header is
 * scrolled past, taking over as the page's navigation. That behaviour is the
 * same at every width.
 *
 * The presentation is not. A phone has no room for four labels beside the
 * product name and the CTA, so below `COMPACT_QUERY` the bar keeps only the
 * product identity at the top, and the sections and CTA move to a dock at the
 * bottom edge where a thumb can reach them.
 *
 * Two pieces of state live outside React because separately rendered components
 * need them:
 *
 * - `--subnav-h` on the document element, so `.phero` can clear this bar as well
 *   as the main one. NavBar already publishes `--nav-h` the same way.
 * - `--nav-shift` and `data-subnav`, so the main header rides upward in step
 *   with this bar. The alternative is a client context provider wrapping the
 *   whole marketing shell to move two fixed-position siblings together.
 */
export function ProductSubNav({ productName, home, items, demo, labels, tint }: Props) {
  const menuLabels = labels ?? FALLBACK_LABELS;
  const [pinned, setPinned] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const here = stripLocale(pathname ?? "/");

  /** Tracks whether the sections are collapsed behind the menu button. */
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /**
   * Drives the whole motion.
   *
   * Both bars ride the page upward together, tracking scroll 1:1, exactly as
   * they would if they were in normal flow. Once both have cleared the top of
   * the viewport the sub-bar comes back down on its own and pins to the top
   * edge, restyled to read as the page's main bar.
   *
   * The shifts are written straight to CSS custom properties rather than through
   * state: they change every frame, and re-rendering a React tree per frame to
   * move two fixed elements would drop frames. Only `pinned`, which changes at
   * most twice per gesture, goes through state.
   */
  useEffect(() => {
    let frame = 0;
    let isPinned = false;

    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const navH = Number.parseFloat(cs.getPropertyValue("--nav-h")) || 112;
      const subH = Number.parseFloat(cs.getPropertyValue("--subnav-h")) || 60;
      const y = window.scrollY;

      // The point where the sub-bar's bottom edge has just left the viewport.
      const gone = navH + subH;
      const next = isPinned ? y > gone - HYSTERESIS : y > gone + HYSTERESIS;

      // Header rides up until it is fully gone, then stays gone.
      root.style.setProperty("--nav-shift", `${-Math.min(y, navH)}px`);
      // Sub-bar rides up until it too is gone. Pinned, CSS overrides this.
      root.style.setProperty("--subnav-shift", `${-Math.min(y, gone)}px`);

      if (next !== isPinned) {
        isPinned = next;
        setPinned(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      const root = document.documentElement;
      root.style.removeProperty("--nav-shift");
      root.style.removeProperty("--subnav-shift");
    };
  }, []);

  /**
   * The transform is only transitioned across a pin change. While the bars are
   * riding the scroll it must track the pointer exactly, and a transition there
   * would make them lag behind the page.
   */
  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), PIN_MS);
    return () => clearTimeout(t);
  }, [pinned]);

  /** Tells the main header it is on a page that manages its position. */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-subnav", "");
    return () => root.removeAttribute("data-subnav");
  }, []);

  /**
   * Publishes both edges the bar occupies: the top bar's height so `.phero` can
   * clear it, and the dock's so `body` can. The dock only exists on phones, so
   * its variable is removed rather than zeroed when it is not rendered.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const root = document.documentElement;
    const publish = () => {
      root.style.setProperty("--subnav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
      // The bar only, not the whole dock: with the sheet open the dock is far
      // taller, and padding the body by that would jump the page on every open.
      const bar = dockRef.current?.querySelector(".subnav__dockbar");
      if (bar) {
        root.style.setProperty("--subnav-dock-h", `${Math.round(bar.getBoundingClientRect().height)}px`);
      } else {
        root.style.removeProperty("--subnav-dock-h");
      }
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    if (dockRef.current) ro.observe(dockRef.current);
    return () => {
      ro.disconnect();
      // Stale heights would pad every other page in the app.
      root.style.removeProperty("--subnav-h");
      root.style.removeProperty("--subnav-dock-h");
    };
  }, [compact]);

  /** The sheet is a narrow-screen affordance; it must not survive a widen. */
  useEffect(() => {
    if (!compact) setMenuOpen(false);
  }, [compact]);

  /** Navigating from inside the sheet should close it. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (dockRef.current && !dockRef.current.contains(t)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const className = [
    "subnav",
    pinned ? "subnav--pinned" : "",
    animating ? "subnav--animating" : "",
    compact ? "subnav--compact" : "",
    menuOpen ? "subnav--menuopen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sections = (
    <nav className="subnav__links" aria-label={productName}>
      {items.map((item) => {
        const active = here === item.href || here === stripLocale(item.href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`subnav__link ${active ? "subnav__link--active" : ""}`.trim()}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const palette = {
    "--product-primary": tint.primary,
    "--product-primary-strong": tint.primaryStrong,
    "--product-supporting": tint.supporting,
    "--product-dark": tint.dark,
  } as React.CSSProperties;

  return (
    <>
    <div
      className={className}
      ref={rootRef}
      style={palette}
    >
      <div className="subnav__inner">
        {/* Carries the current-page state for Overview, which has no nav item. */}
        <Link
          aria-current={here === stripLocale(home) ? "page" : undefined}
          className={`subnav__brand ${here === stripLocale(home) ? "subnav__brand--active" : ""}`.trim()}
          href={home}
        >
          <ProductGlyph />
          <span className="subnav__name">{productName}</span>
        </Link>

        {sections}

        {/* Rendered at every width and revealed by CSS once the bar takes the
            top edge, so the bar never reflows and the server and client agree. */}
        <Link className="subnav__cta" href={demo.href} tabIndex={pinned ? undefined : -1}>
          {demo.label}
        </Link>
      </div>
    </div>

    {/*
      The dock. Rendered only below `COMPACT_QUERY`, because it is a second
      fixed element and leaving it in the tree on desktop would put a duplicate
      of every section link in the accessibility tree for no reason.

      It carries the palette itself: it is a sibling of the bar, not a child, so
      it cannot inherit the custom properties set above.
    */}
    {compact ? (
      <div
        className={`subnav__dock ${menuOpen ? "subnav__dock--open" : ""}`.trim()}
        ref={dockRef}
        style={palette}
      >
        {sections}
        <div className="subnav__dockbar">
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? menuLabels.close : menuLabels.menu}
            className="subnav__toggle"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <span className="subnav__togglebar" />
            <span className="subnav__togglebar" />
            <span className="subnav__togglebar" />
          </button>
          <Link className="subnav__dockcta" href={demo.href}>
            {demo.label}
          </Link>
        </div>
      </div>
    ) : null}
    </>
  );
}
