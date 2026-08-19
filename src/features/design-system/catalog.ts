import { productBrand } from "@/config/brand.config";

/**
 * Catalogue for the design-system reference page.
 *
 * Token NAMES only — every value is read from CSS at render time via
 * var(--token), so this page can never drift from tokens.css. If a swatch
 * shows the wrong colour, the token changed; the page is telling the truth.
 *
 * `PRODUCT_PALETTE` is the one exception: those colours are plain hex in
 * brand.config.ts, not CSS custom properties (they are only ever set inline,
 * per product, on the element that needs them), so there is no token to read
 * from CSS. It is still sourced directly from `productBrand` rather than
 * copied, so it cannot drift from the config either.
 */

export type Swatch = {
  token: string;
  /** Usage rule, where the spec sets one. */
  note?: string;
};

export type SwatchGroup = {
  title: string;
  description?: string;
  swatches: Swatch[];
};

export const COLOR_GROUPS: SwatchGroup[] = [
  {
    title: "Brand",
    description: "Logo-accurate. Text and wordmark only — never interactive elements.",
    swatches: [
      { token: "--brand-blue" },
      { token: "--brand-blue-deep" },
      { token: "--brand-blue-light" },
    ],
  },
  {
    title: "UI",
    description: "The brighter interactive family: buttons, links, focus rings.",
    swatches: [{ token: "--ui-blue" }, { token: "--ui-blue-bright" }, { token: "--ui-blue-deep" }],
  },
  {
    title: "Facet accents",
    description: "One at a time, never together in a single component.",
    swatches: [
      { token: "--brand-green", note: "Success / positive financial ONLY. Never a CTA." },
      { token: "--brand-teal", note: "Secondary and informational tags." },
    ],
  },
  {
    title: "Neutrals",
    swatches: [
      { token: "--ink" },
      { token: "--ink-soft" },
      { token: "--paper" },
      { token: "--white" },
      { token: "--line" },
      { token: "--control-fill", note: "Control body. Not --surface: that is theme-owned." },
    ],
  },
  {
    title: "States",
    swatches: [
      { token: "--state-error" },
      { token: "--state-error-bg" },
      { token: "--state-warning" },
      { token: "--state-warning-bg" },
      { token: "--state-success-text", note: "Success COPY. --brand-green fails AA as text." },
      { token: "--state-success-bg" },
      { token: "--state-focus", note: "3px ring at 2px offset." },
      { token: "--state-disabled-bg" },
      { token: "--state-disabled-text" },
    ],
  },
];

export const TYPE_SCALE = [
  { token: "--text-display-lg", px: 56, family: "display" },
  { token: "--text-display-md", px: 44, family: "display" },
  { token: "--text-display-sm", px: 36, family: "display" },
  { token: "--text-heading", px: 24, family: "display" },
  { token: "--text-body-lg", px: 18, family: "body" },
  { token: "--text-body", px: 15, family: "body" },
  { token: "--text-caption", px: 13, family: "body" },
  { token: "--text-caption-sm", px: 12, family: "body" },
] as const;

export const SPACE_SCALE = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-5",
  "--space-6",
  "--space-7",
  "--space-8",
  "--space-9",
] as const;

export const RADIUS_SCALE = [
  { token: "--radius-sm", use: "small controls" },
  { token: "--radius-md", use: "buttons" },
  { token: "--radius-lg", use: "cards" },
  { token: "--radius-xl", use: "hero panels" },
  { token: "--radius-full", use: "pills, avatars" },
] as const;

export const ELEVATION = ["--shadow-neutral", "--shadow-blue-glow", "--shadow-dark"] as const;

const PRODUCT_NAMES: Record<string, string> = {
  salesverse: "SalesVerse",
  brokerverse: "BrokerVerse",
  agentverse: "AgentVerse",
  customerverse: "CustomerVerse",
  merchantverse: "MerchantVerse",
  claimverse: "ClaimVerse",
};

const ROLE_NOTES = {
  primary: "The vivid brand colour — reference swatch; buttons use primaryStrong instead.",
  primaryStrong: "Flat button fill — white text on top clears WCAG AA on all six.",
  supporting: "Pale tint for washes and light chip backgrounds.",
  dark: "Foreground use — title, lede, link text on --paper.",
} as const;

export type ProductPaletteGroup = {
  product: string;
  /** Raw roles, for rendering live button/card specimens. */
  palette: { primary: string; primaryStrong: string; supporting: string; dark: string };
  swatches: { role: keyof typeof ROLE_NOTES; hex: string; note: string }[];
};

export const PRODUCT_PALETTE: ProductPaletteGroup[] = Object.entries(productBrand).map(
  ([slug, palette]) => ({
    product: PRODUCT_NAMES[slug] ?? slug,
    palette,
    swatches: (Object.keys(ROLE_NOTES) as (keyof typeof ROLE_NOTES)[]).map((role) => ({
      role,
      hex: palette[role],
      note: ROLE_NOTES[role],
    })),
  }),
);
