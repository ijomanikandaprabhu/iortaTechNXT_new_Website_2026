/**
 * Scroll-timed copy. Each scene is placed against what the footage is actually
 * showing at that point, not spaced evenly:
 *
 *   0.00–0.15  sky above the cloud line
 *   0.17       glass facade, city below
 *   0.25       office floor, desks, papers in the air
 *   0.34–0.42  rows of desks, paper stacks
 *   0.50–0.67  one worker, monitor then laptop
 *   0.75       desk receding behind the glass
 *   0.84–1.00  facade, then the full building
 */

/**
 * Windows are explicit rather than derived from a centre point. Deriving them
 * produced spans wider than the gaps between scenes, so two scenes were on
 * screen at once — every `exitTo` below is now strictly before the next
 * scene's `enterFrom`, which `assertNoOverlap` enforces in tests.
 */
export type Scene = {
  /** i18n key under `home.scenes`. Value uses \n for line breaks. */
  key: "s1" | "s2" | "s3" | "s4" | "s5";
  /** Lines begin wiping in. */
  enterFrom: number;
  /** Last line is fully in. */
  enterTo: number;
  /** Block begins fading out. */
  exitFrom: number;
  /** Fully gone. */
  exitTo: number;
};

export const SCENES: Scene[] = [
  // Traditional office + the work multiplying.
  { key: "s1", enterFrom: 0.2, enterTo: 0.26, exitFrom: 0.34, exitTo: 0.38 },
  // Teams surrounded by complexity.
  { key: "s2", enterFrom: 0.45, enterTo: 0.51, exitFrom: 0.55, exitTo: 0.59 },
  // The turn — camera begins pulling away.
  { key: "s3", enterFrom: 0.61, enterTo: 0.66, exitFrom: 0.7, exitTo: 0.73 },
  // Desk receding behind the glass.
  { key: "s4", enterFrom: 0.75, enterTo: 0.8, exitFrom: 0.83, exitTo: 0.86 },
  // The building. Holds to the end of the sequence.
  { key: "s5", enterFrom: 0.89, enterTo: 0.94, exitFrom: 1.01, exitTo: 1.02 },
];

/** Returns the pairs that overlap. Empty means every scene is exclusive. */
export function findOverlaps(scenes: Scene[] = SCENES): string[] {
  const bad: string[] = [];
  for (let i = 1; i < scenes.length; i++) {
    const prev = scenes[i - 1]!;
    const next = scenes[i]!;
    if (prev.exitTo > next.enterFrom) bad.push(`${prev.key}->${next.key}`);
  }
  return bad;
}

function ramp(value: number, from: number, to: number): number {
  if (to <= from) return value >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

/** Smoothstep — settles without overshoot, so nothing springs. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

export type LineState = {
  /** 0→1 reveal used for the wipe and the rise. */
  reveal: number;
  /** Whole-block fade on exit. */
  exit: number;
};

/**
 * Per-line entrance. Lines wipe up one after another as the scene arrives,
 * then the block leaves together — staggering the exit as well reads as
 * indecision rather than rhythm.
 *
 * Driven entirely by scroll, so it scrubs in both directions.
 */
export function lineState(
  progress: number,
  scene: Scene,
  lineIndex: number,
  lineCount: number,
): LineState {
  const span = scene.enterTo - scene.enterFrom;

  // Each line takes 60% of the window; the rest is spread across the stagger.
  const perLine = lineCount > 1 ? (span * 0.4) / (lineCount - 1) : 0;
  const from = scene.enterFrom + perLine * lineIndex;
  const to = from + span * 0.6;

  return {
    reveal: ease(ramp(progress, from, to)),
    exit: ease(ramp(progress, scene.exitFrom, scene.exitTo)),
  };
}
