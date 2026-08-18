"use client";

import { useEffect, useRef, useState } from "react";
import { DotPattern } from "@/components/ui/DotPattern";

/** Grid pitch in CSS px. */
const SPACING = 15;
const DOT_R = 1.15;
/** Dots inside this radius of the pointer are pushed. */
const INFLUENCE = 150;
/** Maximum displacement, at the pointer itself. */
const MAX_PUSH = 22;
/** Approach rate, expressed per 16.7ms so the feel is identical at 60/120Hz. */
const EASE = 0.18;
const DOT_COLOUR = "rgba(10, 14, 26, 0.16)";

/**
 * Dot field that repels from the pointer.
 *
 * Canvas rather than the SVG <pattern>: a pattern tiles one static circle, so
 * individual dots cannot be displaced. DotPattern is still used for the
 * reduced-motion case, where a static field is the right answer anyway.
 *
 * Cost control — the field is ~7,600 dots at this pitch, far too many to
 * redraw every frame:
 *  - the full grid is painted once, on mount and on resize
 *  - each frame clears and repaints only the rectangle around the pointer
 *    (previous ∪ current), which is a few hundred dots
 *  - the loop stops once the field settles, and restarts on the next move
 */
export function SkyDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced !== false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // Smoothed pointer, plus an amplitude that fades the effect in and out.
    let px = -9999;
    let py = -9999;
    let targetX = -9999;
    let targetY = -9999;
    let amp = 0;
    let targetAmp = 0;

    let prevX = -9999;
    let prevY = -9999;
    let rafId = 0;
    let running = false;
    let lastTime = 0;

    // Canvas position, cached. Reading it per pointermove forces a layout on
    // every mouse event, which is what made the motion feel gritty.
    let rectLeft = 0;
    let rectTop = 0;

    // Dots are blitted from a pre-rendered sprite. Stroking several hundred
    // arcs per frame was the main cost; drawImage of a cached bitmap is far
    // cheaper and removes the per-frame path work.
    const sprite = document.createElement("canvas");
    const spriteCtx = sprite.getContext("2d")!;

    /**
     * Repaints dots for every grid origin in the given box.
     *
     * Bounds must already be multiples of SPACING. Flooring them here (as an
     * earlier version did) painted a row and column outside the rectangle the
     * caller had cleared, so those dots were never erased and darkened on
     * every frame.
     */
    function paintRegion(gx0: number, gy0: number, gx1: number, gy1: number) {
      const half = DOT_R + 1;
      const size = half * 2;
      for (let gx = gx0; gx <= gx1; gx += SPACING) {
        for (let gy = gy0; gy <= gy1; gy += SPACING) {
          let dx = gx;
          let dy = gy;

          if (amp > 0.001) {
            const vx = gx - px;
            const vy = gy - py;
            const dist = Math.hypot(vx, vy);
            if (dist < INFLUENCE && dist > 0.0001) {
              // Quadratic falloff: firm at the pointer, gentle at the rim.
              const falloff = (1 - dist / INFLUENCE) ** 2;
              const push = MAX_PUSH * falloff * amp;
              dx += (vx / dist) * push;
              dy += (vy / dist) * push;
            }
          }

          ctx!.drawImage(sprite, dx - half, dy - half, size, size);
        }
      }
    }

    function paintAll() {
      ctx!.clearRect(0, 0, width, height);
      paintRegion(0, 0, Math.ceil(width / SPACING) * SPACING, Math.ceil(height / SPACING) * SPACING);
    }

    function measure() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rectLeft = rect.left;
      rectTop = rect.top;
      width = rect.width;
      height = rect.height;

      // Sprite is rendered at device resolution so blits stay crisp.
      const sizeCss = DOT_R * 2 + 2;
      sprite.width = Math.ceil(sizeCss * dpr);
      sprite.height = Math.ceil(sizeCss * dpr);
      spriteCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spriteCtx.clearRect(0, 0, sizeCss, sizeCss);
      spriteCtx.fillStyle = DOT_COLOUR;
      spriteCtx.beginPath();
      spriteCtx.arc(sizeCss / 2, sizeCss / 2, DOT_R, 0, Math.PI * 2);
      spriteCtx.fill();

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintAll();
    }

    // Region touched by the pointer, padded for the displacement itself.
    const PAD = INFLUENCE + MAX_PUSH + DOT_R + 2;

    function tick(now: number) {
      const delta = lastTime ? Math.min(64, now - lastTime) : 16.7;
      lastTime = now;
      // Frame-rate independent approach; a fixed per-frame factor moves twice
      // as fast on a 120Hz display, which reads as inconsistent.
      const k = 1 - Math.pow(1 - EASE, delta / 16.7);

      prevX = px;
      prevY = py;

      px += (targetX - px) * k;
      py += (targetY - py) * k;
      amp += (targetAmp - amp) * k;

      /**
       * Snap the region out to whole grid cells before clearing.
       *
       * paintRegion floors its start down to the grid, so an un-snapped
       * rectangle painted a row and column of dots OUTSIDE the area that had
       * just been cleared. Those never got erased and darkened on every frame
       * — the visible band of heavy dots. Clearing the same snapped bounds it
       * paints keeps the two exactly in step.
       */
      /**
       * Grid-aligned origins to repaint. PAD covers INFLUENCE + MAX_PUSH, so
       * dots at these boundaries are beyond the pointer's reach and sit
       * exactly on their origin — which means every painted dot lands inside
       * [gx0, gx1] and clearing that span (plus one dot radius) is exact.
       */
      const gx0 = Math.max(0, Math.floor((Math.min(prevX, px) - PAD) / SPACING) * SPACING);
      const gy0 = Math.max(0, Math.floor((Math.min(prevY, py) - PAD) / SPACING) * SPACING);
      const gx1 = Math.ceil((Math.max(prevX, px) + PAD) / SPACING) * SPACING;
      const gy1 = Math.ceil((Math.max(prevY, py) + PAD) / SPACING) * SPACING;

      if (gx1 > gx0 && gy1 > gy0) {
        const edge = DOT_R + 2;
        ctx!.clearRect(gx0 - edge, gy0 - edge, gx1 - gx0 + edge * 2, gy1 - gy0 + edge * 2);
        paintRegion(gx0, gy0, gx1, gy1);
      }

      const settled =
        Math.abs(targetX - px) < 0.3 &&
        Math.abs(targetY - py) < 0.3 &&
        Math.abs(targetAmp - amp) < 0.005;

      if (settled) {
        running = false;
        lastTime = 0;
        // One clean pass so the resting field has no seams from partial repaints.
        if (targetAmp === 0) paintAll();
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX - rectLeft;
      targetY = event.clientY - rectTop;
      targetAmp = 1;
      // Jump on first entry rather than sweeping in from off-screen.
      if (px < -9000) {
        px = targetX;
        py = targetY;
      }
      start();
    }

    function onPointerLeave() {
      targetAmp = 0;
      start();
    }

    function cacheRect() {
      const r = canvas!.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    measure();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", cacheRect, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", cacheRect);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <div className="skydots" aria-hidden="true">
      {reduced ? (
        <DotPattern width={SPACING} height={SPACING} cx={1.3} cy={1.3} cr={DOT_R} />
      ) : (
        <canvas ref={canvasRef} className="skydots__canvas" />
      )}
    </div>
  );
}
