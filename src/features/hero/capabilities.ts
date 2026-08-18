/**
 * The capability arc: 12 icons that fan in as the figure looks up from the
 * laptop, then gather as the camera pulls back.
 *
 * Icon files are placeholders in public/brand/icons/. Replace each SVG in
 * place (keep the 96x96 viewBox and the filename) — nothing here changes.
 */

/**
 * Slugs are derived from the message bundle, so adding an icon without adding
 * its translation (or vice versa) is a compile error rather than a silent
 * missing label.
 */
export type CapabilitySlug = keyof IntlMessages["home"]["sequence"]["capabilities"];

export type Capability = {
  /** Matches public/brand/icons/<slug>.<ext> and the i18n key. */
  slug: CapabilitySlug;
};

export const CAPABILITIES: Capability[] = [
  { slug: "core-insurance" },
  { slug: "customer-agent" },
  { slug: "sales-distribution" },
  { slug: "claims-management" },
  { slug: "payments-finance" },
  { slug: "digital-insurtech" },
  { slug: "data-analytics" },
  { slug: "security-compliance" },
  { slug: "communication-support" },
  { slug: "insurance-categories" },
  { slug: "system-ui" },
  { slug: "ai-automation" },
];

export const ICON_DIR = "/brand/icons";

/**
 * File extension for the icon set. Currently numbered placeholders awaiting
 * the real artwork — drop the final files into public/brand/icons/ using the
 * same slugs. Change this to "png" if they arrive as raster instead.
 */
export const ICON_EXT = "svg";

/**
 * Timing, in scroll progress. Derived from the footage:
 *   0.52–0.63  camera swings front-on, he looks up
 *   0.63–0.73  holds front-on, gaze raised
 *   0.73–1.00  continuous pull-back to the full building
 */
export const ARC_TIMING = {
  /** Reveal begins on the back-view desk shot with the paper stacks (frame ~80). */
  fanStart: 0.42,
  fanEnd: 0.55,
  /** Held at full spread through the front-on look-up. */
  holdEnd: 0.64,
  /** Gathered into the laptop and gone as the desk recedes behind the glass (frame ~148). */
  gatherEnd: 0.78,
} as const;

/**
 * Arc geometry, in viewport units. The centre sits on his gaze so the arc
 * reads as what he is looking at, not as decoration floating on top.
 */
export const ARC = {
  centerX: 50, // % of viewport width
  /**
   * Sits low so the arc opens overhead. Measured against the close-up at
   * ~0.60: a tighter arc crossed the figure's face.
   */
  centerY: 62, // % of viewport height
  /** Radius as a % of the smaller viewport dimension. */
  radius: 46,
  radiusMobile: 52,
  /** Sweep across the top, in degrees. 180 = left, 360 = right. */
  startAngle: 200,
  endAngle: 340,
  /**
   * Icons emerge from a point above his head — the direction he is looking —
   * rather than from his face, which the fan would sweep across.
   */
  emergeX: 50,
  emergeY: 24,

  /**
   * They do not return there. They converge into the laptop and vanish.
   * The gather runs into the pull-back, so the desk recedes and rises in
   * frame while the icons travel — the target moves with it.
   */
  laptopStartX: 50,
  laptopStartY: 66,
  laptopEndX: 50,
  laptopEndY: 59,
} as const;
