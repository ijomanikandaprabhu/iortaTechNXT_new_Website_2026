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
