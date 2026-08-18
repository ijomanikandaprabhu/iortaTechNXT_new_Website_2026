/**
 * Catalogue for the design-system reference page.
 *
 * Token NAMES only — every value is read from CSS at render time via
 * var(--token), so this page can never drift from tokens.css. If a swatch
 * shows the wrong colour, the token changed; the page is telling the truth.
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
