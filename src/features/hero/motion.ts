import { DWELL_PEAK, DWELL_WIDTH } from "./config";

/**
 * Dwell remapping: slows playback near chapter centres and speeds it slightly
 * between them, so copy stays readable without the scroll feeling sticky.
 *
 * Implemented as a normalised integral of a speed function — the remap is
 * monotonic, so scrubbing never reverses.
 */
export function buildDwellRemap(centers: number[], samples = 256): (p: number) => number {
  // Speed is low near a centre, 1 elsewhere.
  const speedAt = (p: number) => {
    let slow = 0;
    for (const c of centers) {
      const d = (p - c) / DWELL_WIDTH;
      slow += Math.exp(-d * d);
    }
    return 1 / (1 + slow * (DWELL_PEAK - 1));
  };

  // Cumulative distribution of speed across the timeline.
  const cdf = new Float64Array(samples + 1);
  for (let i = 1; i <= samples; i++) {
    const p = i / samples;
    cdf[i] = cdf[i - 1]! + speedAt(p);
  }
  const total = cdf[samples]!;
  for (let i = 0; i <= samples; i++) cdf[i] = cdf[i]! / total;

  return (p: number) => {
    const clamped = Math.min(1, Math.max(0, p));
    const x = clamped * samples;
    const i = Math.min(samples - 1, Math.floor(x));
    const t = x - i;
    return cdf[i]! + (cdf[i + 1]! - cdf[i]!) * t;
  };
}

/** Frame-rate independent smoothing, so scrub feel is the same at 60 and 120Hz. */
export function lerp(current: number, target: number, factor: number, deltaMs: number): number {
  const t = 1 - Math.pow(1 - factor, deltaMs / 16.667);
  return current + (target - current) * t;
}

/** Visibility ramp for a chapter, 0→1→0 around its centre. */
export function chapterOpacity(progress: number, at: number, hold: number): number {
  const distance = Math.abs(progress - at);
  if (distance <= hold * 0.5) return 1;
  const fade = hold * 0.5;
  return Math.max(0, 1 - (distance - hold * 0.5) / fade);
}
