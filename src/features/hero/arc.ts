import { ARC, ARC_TIMING } from "./capabilities";

export type IconTransform = {
  /** Offset from the arc centre, in viewport-relative px. */
  x: number;
  y: number;
  scale: number;
  opacity: number;
};

/** 0→1 ramp across [from, to], clamped. */
function ramp(value: number, from: number, to: number): number {
  if (to <= from) return value >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

/** Smoothstep — no overshoot, so nothing springs. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Where icon `index` sits at a given scroll progress.
 *
 * Three phases, driven entirely by scroll (never by time), so the arc scrubs
 * with the film in both directions:
 *   fan     icons travel from the gather point out to their arc position
 *   hold    full spread
 *   gather  they converge back to the gather point and fade
 *
 * `stagger` offsets each icon slightly so the fan reads as a sweep rather
 * than twelve things appearing at once.
 */
export function iconTransform(
  index: number,
  count: number,
  progress: number,
  viewport: { width: number; height: number },
): IconTransform {
  const { startAngle, endAngle, centerX, centerY } = ARC;
  const isMobile = viewport.width < 768;
  const radiusPct = isMobile ? ARC.radiusMobile : ARC.radius;
  const minDim = Math.min(viewport.width, viewport.height);
  const radius = (radiusPct / 100) * minDim;

  // Arc position for this icon.
  const t = count === 1 ? 0.5 : index / (count - 1);
  const angle = ((startAngle + (endAngle - startAngle) * t) * Math.PI) / 180;
  const restX = (centerX / 100) * viewport.width + Math.cos(angle) * radius;
  const restY = (centerY / 100) * viewport.height + Math.sin(angle) * radius;

  // The point they emerge from — above his head, along his gaze.
  const originX = (ARC.emergeX / 100) * viewport.width;
  const originY = (ARC.emergeY / 100) * viewport.height;

  // Stagger: at most 45% of the fan window, spread across the arc.
  const stagger = (index / Math.max(1, count - 1)) * 0.45;
  const fanSpan = ARC_TIMING.fanEnd - ARC_TIMING.fanStart;
  const fanFrom = ARC_TIMING.fanStart + stagger * fanSpan;
  const fanTo = fanFrom + fanSpan * (1 - stagger);

  const fan = ease(ramp(progress, fanFrom, fanTo));
  const gather = ease(ramp(progress, ARC_TIMING.holdEnd, ARC_TIMING.gatherEnd));

  // Phase 1: emerge point → arc position.
  const fannedX = originX + (restX - originX) * fan;
  const fannedY = originY + (restY - originY) * fan;

  // Phase 2: arc position → the laptop, which is itself receding.
  const targetX = ((ARC.laptopStartX + (ARC.laptopEndX - ARC.laptopStartX) * gather) / 100) * viewport.width;
  const targetY = ((ARC.laptopStartY + (ARC.laptopEndY - ARC.laptopStartY) * gather) / 100) * viewport.height;

  return {
    x: fannedX + (targetX - fannedX) * gather,
    y: fannedY + (targetY - fannedY) * gather,
    // Shrink into the laptop rather than just fading on the spot.
    scale: (0.25 + 0.75 * fan) * (1 - 0.88 * gather),
    // Held until they are almost there, so they visibly enter the screen.
    opacity: Math.max(0, fan * (1 - gather * gather * gather)),
  };
}
