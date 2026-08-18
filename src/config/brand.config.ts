/**
 * Brand asset registry. Artwork is the supplied TECHNXT lockup (841×239).
 *
 * `icon` and `shield-filled` are the same file: in this identity the icon IS
 * a gradient shield, so there is no separate bare-icon form. `shield-outline`
 * is derived from it — white body, blue stroke — for light backgrounds.
 */
export const brandAssets = {
  /** Full lockup: wordmark + icon. */
  full: "/brand/technxt-lockup.svg",
  /** Icon alone, for square/compact contexts only. */
  icon: "/brand/technxt-icon.svg",
  /** Shield, gradient fill — for dark or photographic backgrounds. */
  "shield-filled": "/brand/technxt-shield-filled.svg",
  /** Shield, white fill with blue stroke — for light backgrounds. */
  "shield-outline": "/brand/technxt-shield-outline.svg",
} as const;

export type LogoVariant = keyof typeof brandAssets;

/**
 * Minimum rendered size per variant, in px. Below these the internal facet
 * lines blur together, so they are enforced rather than documented.
 * `full` is measured as width; the others are square.
 */
export const logoMinSize: Record<LogoVariant, number> = {
  full: 160,
  icon: 32,
  "shield-filled": 48,
  "shield-outline": 48,
};

/**
 * Aspect ratio (width / height) of the full lockup. Measured from the supplied
 * artwork: 841 × 239.
 */
export const lockupAspectRatio = 841 / 239;

/**
 * Brand hue and saturation per Verse product.
 *
 * Stored as HSL channels rather than hex so one formula in bento.css can derive
 * a whole gradient from them, and so the six cards stay a family: identical
 * lightness curve, only the hue moves.
 *
 * ## Artwork only
 *
 * These drive background washes and never text, links, borders or focus rings.
 * Yellow is the reason: ClaimVerse's lemon as a foreground colour measures
 * 1.9:1 on white, far below the 4.5:1 floor. Interactive colour stays on
 * `--ui-blue`, which is the same for every product.
 *
 * ## Why SalesVerse is 32 and not 70
 *
 * It was supplied as "Bronze 70", but hue 70 renders as plain yellow, and at
 * 15 degrees from ClaimVerse's lemon the two products were indistinguishable
 * as pale washes. 32 reads as actual bronze and separates the pair.
 */
export const productBrand: Record<string, { h: number; s: number }> = {
  salesverse: { h: 32, s: 55 },
  agentverse: { h: 310, s: 58 },
  customerverse: { h: 230, s: 72 },
  merchantverse: { h: 345, s: 70 },
  claimverse: { h: 52, s: 88 },
  brokerverse: { h: 272, s: 60 },
};
