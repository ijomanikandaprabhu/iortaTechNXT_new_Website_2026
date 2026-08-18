/** Frame sequence configuration. Mirrors public/hero/manifest.json. */

export const FRAME_COUNT = 192;

/** Pinned scroll distance. 350vh ≈ 3.5 screens of scrub. */
export const SCROLL_VH = 350;

export const SOURCES = {
  desktop: { dir: "/hero/desktop", width: 1280, height: 720 },
  mobile: { dir: "/hero/mobile", width: 720, height: 405 },
} as const;

/** Below this viewport width we load the lighter set. */
export const MOBILE_BREAKPOINT = 768;

/**
 * Motion engine. Dwell creates readable slow zones at chapter centres while
 * keeping playback continuous in between.
 */
export const DWELL_WIDTH = 0.04;
export const DWELL_PEAK = 2.8;
export const LERP_FACTOR = 0.11;

/** Frame shown when prefers-reduced-motion is set: the tower at dawn. */
export const POSTER_FRAME = 186;

/**
 * Chapter placements, kept for reference. The copy overlay is currently not
 * rendered; these positions were mapped against the footage's negative space
 * and are the starting point if it is reinstated.
 */
export type Chapter = {
  key: "ch1" | "ch2" | "ch3" | "ch4";
  /** Scroll progress 0–1 at the centre of the chapter. */
  at: number;
  /** How long it stays legible, in progress units. */
  hold: number;
  /** Where the copy sits — chosen from the contact sheet. */
  position: "left" | "right" | "center";
};

export const CHAPTERS: Chapter[] = [
  // Open sky above the cloud line — the frame is almost entirely empty.
  { key: "ch1", at: 0.06, hold: 0.13, position: "left" },
  // Glass facade, figures small and centred — space at the top.
  { key: "ch2", at: 0.34, hold: 0.11, position: "center" },
  // Desks and monitors fill the lower frame — copy goes high.
  { key: "ch3", at: 0.58, hold: 0.11, position: "right" },
  // Single figure at the window, seated left — copy goes right.
  { key: "ch4", at: 0.8, hold: 0.11, position: "right" },
];

/**
 * Dwell centres follow chapter centres. With the copy overlay removed there is
 * nothing to hold on, so playback is linear — an empty list makes the remap an
 * identity function. Restore paced playback with `CHAPTERS.map((c) => c.at)`.
 */
export const DWELL_CENTERS: number[] = [];
