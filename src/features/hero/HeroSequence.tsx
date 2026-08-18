"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DWELL_CENTERS,
  FRAME_COUNT,
  LERP_FACTOR,
  MOBILE_BREAKPOINT,
  POSTER_FRAME,
  SCROLL_VH,
  SOURCES,
} from "./config";
import {
  createFrameStore,
  disposeStore,
  loadSequence,
  nearestLoaded,
  type FrameStore,
} from "./frameLoader";
import { buildDwellRemap, lerp } from "./motion";
import { ARC_TIMING, CAPABILITIES, ICON_DIR, ICON_EXT } from "./capabilities";
import { iconTransform } from "./arc";
import { SCENES } from "./scenes";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { HeroIntro } from "./HeroIntro";

/** The opening block holds over the sky, then clears before the first scene. */
const INTRO_FADE_FROM = 0.06;
const INTRO_FADE_TO = 0.13;

/** The inset card expands to full bleed across this range. */
const CARD_EXPAND_TO = 0.1;

const MAX_DPR = 2;

/**
 * Scroll-driven frame sequence with scene copy and the capability arc.
 * No panel or scrim behind the copy — legibility comes from the type
 * treatment itself.
 */
export function HeroSequence() {
  const t = useTranslations("home.sequence");
  const tScene = useTranslations("home.scenes");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Which scene is on screen. This is the one piece of React state the loop
   * touches, and it changes six times across the whole scroll — never per
   * frame — so BlurReveal can own its own enter/exit animation.
   */
  const [activeScene, setActiveScene] = useState(-1);
  const activeRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    if (!canvas || !pin) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const source = isMobile ? SOURCES.mobile : SOURCES.desktop;

    const store: FrameStore = createFrameStore(FRAME_COUNT);
    const controller = new AbortController();
    const remap = buildDwellRemap(DWELL_CENTERS);

    // ---- Cached layout. Read on resize only, never inside the rAF loop. ----
    let pinTop = 0;
    let scrollRange = 1;
    let cssWidth = 0;
    let cssHeight = 0;

    /**
     * Sizes the backing store to the canvas's own box, not the viewport: the
     * card is inset at rest and expands on scroll, so those differ. Using the
     * viewport left the film clipped off-centre inside the card.
     */
    function measure() {
      const rect = pin!.getBoundingClientRect();
      pinTop = rect.top + window.scrollY;
      scrollRange = Math.max(1, pin!.offsetHeight - window.innerHeight);

      const box = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cssWidth = box.width;
      cssHeight = box.height;
      canvas!.width = Math.max(1, Math.round(cssWidth * dpr));
      canvas!.height = Math.max(1, Math.round(cssHeight * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(lastDrawn < 0 ? 0 : lastDrawn, true);
    }

    // ---- Draw: cover fit, preserving aspect ratio. ----
    let lastDrawn = -1;

    function draw(index: number, force = false) {
      if (index === lastDrawn && !force) return;
      const resolved = nearestLoaded(store, index);
      if (resolved === null) return;

      const bitmap = store.bitmaps[resolved];
      if (!bitmap) return;

      const scale = Math.max(cssWidth / bitmap.width, cssHeight / bitmap.height);
      const w = bitmap.width * scale;
      const h = bitmap.height * scale;
      ctx!.drawImage(bitmap, (cssWidth - w) / 2, (cssHeight - h) / 2, w, h);
      lastDrawn = index;
    }

    // ---- Scroll state. The listener only stores a number. ----
    let rawProgress = 0;

    function onScroll() {
      rawProgress = Math.min(1, Math.max(0, (window.scrollY - pinTop) / scrollRange));
    }

    /**
     * Positions the capability arc. Driven by un-smoothed scroll progress and
     * written straight to style — no React state, so it costs nothing per frame.
     */
    function updateArc(progress: number) {
      const viewport = { width: cssWidth, height: cssHeight };
      for (let i = 0; i < iconRefs.current.length; i++) {
        const el = iconRefs.current[i];
        if (!el) continue;
        const { x, y, scale, opacity } = iconTransform(
          i,
          CAPABILITIES.length,
          progress,
          viewport,
        );
        el.style.opacity = String(opacity);
        el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
    }

    /**
     * Expands the inset card to full bleed. Writes a single custom property;
     * the gap, radius and top offset are derived from it in CSS, so one
     * assignment moves all three.
     */
    let lastCardT = -1;
    function updateCard(progress: number) {
      const el = sectionRef.current;
      if (!el) return;
      const raw = Math.min(1, Math.max(0, progress / CARD_EXPAND_TO));
      const t = Math.round(raw * raw * (3 - 2 * raw) * 1000) / 1000;
      if (t === lastCardT) return;
      lastCardT = t;
      el.style.setProperty("--hero-t", String(t));
    }

    /** Opening block clears as the film leaves the sky. */
    function updateIntro(progress: number) {
      const el = introRef.current;
      if (!el) return;
      const t = Math.min(
        1,
        Math.max(0, (progress - INTRO_FADE_FROM) / (INTRO_FADE_TO - INTRO_FADE_FROM)),
      );
      const opacity = 1 - t * t * (3 - 2 * t);
      el.style.opacity = String(opacity);
      el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      // Drifts up slightly as it leaves, so it reads as departing rather than
      // simply switching off.
      el.style.transform = `translate3d(0, ${-t * 40}px, 0)`;
    }

    /**
     * Picks the scene whose window contains the current progress. Windows never
     * overlap (enforced by scenes.test.ts), so at most one matches. State is
     * only written when the index actually changes.
     */
    function updateScenes(progress: number) {
      let next = -1;
      for (let i = 0; i < SCENES.length; i++) {
        const scene = SCENES[i]!;
        if (progress >= scene.enterFrom && progress < scene.exitTo) {
          next = i;
          break;
        }
      }
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActiveScene(next);
      }
    }

    // ---- Animation loop ----
    let current = 0;
    let rafId = 0;
    let lastTime = performance.now();
    let running = true;

    function tick(now: number) {
      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      const remapped = remap(rawProgress);
      const target = remapped * (FRAME_COUNT - 1);

      current = lerp(current, target, LERP_FACTOR, delta);
      // Snap at the ends so the first and last frames are always exact.
      if (Math.abs(current - target) < 0.01) current = target;

      draw(Math.round(current));
      // Arc and copy follow raw remapped progress, not the LERP-smoothed
      // frame, so they track the scroll exactly rather than lagging the film.
      updateArc(remapped);
      updateScenes(remapped);
      updateIntro(remapped);
      updateCard(remapped);

      if (running) rafId = requestAnimationFrame(tick);
    }

    // ---- Reduced motion: one stable frame, no scroll binding. ----
    if (reduceMotion) {
      measure();
      void loadSequence({
        dir: source.dir,
        count: FRAME_COUNT,
        store,
        signal: controller.signal,
        concurrency: 2,
        onCriticalReady: () => draw(POSTER_FRAME, true),
      });
      // Hold the arc at full spread and show the closing line — the
      // composition, without the movement.
      const closing = SCENES[SCENES.length - 1]!;
      updateArc(ARC_TIMING.holdEnd);
      updateScenes(closing.enterTo);
      const onResizeStatic = () => {
        measure();
        draw(POSTER_FRAME, true);
        updateArc(ARC_TIMING.holdEnd);
        updateScenes(closing.enterTo);
      };
      window.addEventListener("resize", onResizeStatic);
      return () => {
        window.removeEventListener("resize", onResizeStatic);
        controller.abort();
        disposeStore(store);
      };
    }

    measure();
    onScroll();

    void loadSequence({
      dir: source.dir,
      count: FRAME_COUNT,
      store,
      signal: controller.signal,
      onCriticalReady: () => draw(Math.round(current), true),
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
      draw(lastDrawn < 0 ? 0 : lastDrawn, true);
    };
    window.addEventListener("resize", onResize);

    // The card resizes continuously as it expands; observing is cheaper and
    // more accurate than reading layout inside the animation loop.
    const ro = new ResizeObserver(() => measure());
    ro.observe(canvas);

    // Stop burning frames while the tab is hidden.
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      controller.abort();
      disposeStore(store);
    };
  }, []);

  return (
    <section className="seq" aria-label={t("label")} ref={sectionRef}>
      <div className="seq__pin" ref={pinRef} style={{ height: `${SCROLL_VH}vh` }}>
        <div className="seq__stage">
          <canvas ref={canvasRef} className="seq__canvas" aria-hidden="true" />

          {/* Film grain. Sits directly on the footage, below the copy and the
              arc, so it textures the image without dirtying the type. */}
          <div className="seq__noise" aria-hidden="true" />

          {/* Opening block over the sky frames. */}
          <div className="intro__wrap" ref={introRef}>
            <HeroIntro />
          </div>

          {/* Capability arc. Purely visual — the accessible copy of this list
              is the visually-hidden <ul> below, so screen readers and crawlers
              get the capability names without any text over the film. */}
          <div className="seq__arc" aria-hidden="true">
            {CAPABILITIES.map((capability, i) => (
              <div
                key={capability.slug}
                className="seq__icon"
                style={{ opacity: 0 }}
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ICON_DIR}/${capability.slug}.${ICON_EXT}`}
                  alt=""
                  width={96}
                  height={96}
                />
              </div>
            ))}
          </div>

          {/* Scene copy, centred. Real headings in the DOM — the canvas is
              invisible to crawlers, so this carries the page's narrative. */}
          <div className="seq__scenes">
            {activeScene >= 0 && (
              <div className="seq__scene" key={SCENES[activeScene]!.key}>
                <h2 className="seq__line">
                  {tScene(SCENES[activeScene]!.key)
                    .split("\n")
                    .map((line, n) =>
                      line === "" ? (
                        <span key={n} className="seq__gap" aria-hidden="true" />
                      ) : (
                        <BlurReveal
                          key={n}
                          as="span"
                          className="seq__linetext"
                          // Lines cascade rather than revealing together.
                          delay={n * 0.12}
                          speedReveal={1.6}
                          speedSegment={0.7}
                        >
                          {line}
                        </BlurReveal>
                      ),
                    )}
                </h2>
              </div>
            )}
          </div>

          <ul className="u-visually-hidden">
            {CAPABILITIES.map((capability) => (
              <li key={capability.slug}>{t(`capabilities.${capability.slug}`)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
