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
 * Brand palette per Verse product: four roles per product rather than one
 * hue, so each role can be accessible where the others cannot be.
 *
 * - `primary` — the vivid brand colour. Flat fills only (buttons, chips),
 *   paired with dark text — white text on the raw value fails WCAG AA on
 *   most of the six (AgentVerse/CustomerVerse/MerchantVerse fail badly).
 * - `primaryStrong` — same hue and saturation as `primary`, darkened to a
 *   fixed 27% lightness. This is what the primary CTA button actually uses:
 *   a flat fill dark enough that WHITE text clears WCAG AA on all six
 *   (verified; AgentVerse is the tightest margin at ~5.1:1), while staying
 *   visibly the same colour family as `primary` rather than falling back to
 *   `dark`, which reads as near-black and would lose the product's colour
 *   entirely.
 * - `supporting` — the pale tint for washes and light chip backgrounds.
 * - `dark` — a near-black, product-specific shade built for foreground use:
 *   title/lede/link text and anything else that needs to sit on `--paper`.
 *   This is what makes ClaimVerse's pink legible as text at all — the raw
 *   value measures well below the 4.5:1 floor as foreground colour, but its
 *   `dark` tone is designed to clear that floor while staying recognisably
 *   part of the same family.
 */
export type ProductPalette = {
  primary: string;
  primaryStrong: string;
  supporting: string;
  dark: string;
};

export const productBrand: Record<string, ProductPalette> = {
  salesverse: {
    primary: "#7C5CFC",
    primaryStrong: "#1D0287",
    supporting: "#A78BFA",
    dark: "#17122E",
  },
  brokerverse: {
    primary: "#2878FF",
    primaryStrong: "#00338A",
    supporting: "#60A5FA",
    dark: "#0C1C35",
  },
  agentverse: {
    primary: "#00AFC8",
    primaryStrong: "#00798A",
    supporting: "#5EE7E7",
    dark: "#08272D",
  },
  customerverse: {
    primary: "#16B87A",
    primaryStrong: "#0F7B52",
    supporting: "#6EE7B7",
    dark: "#09291E",
  },
  merchantverse: {
    primary: "#F59A23",
    primaryStrong: "#844D06",
    supporting: "#FBBF5A",
    dark: "#30200B",
  },
  claimverse: {
    primary: "#E9508F",
    primaryStrong: "#7A0F3B",
    supporting: "#F58AB7",
    dark: "#321020",
  },
};
