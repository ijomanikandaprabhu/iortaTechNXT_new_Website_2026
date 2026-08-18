/**
 * Bottom ticker figures.
 *
 * ⚠ PLACEHOLDER VALUES — every number below is invented. They exist so the
 * marquee can be built and reviewed; they are NOT claims about the business.
 * Replace each `value` with a real figure (or wire this to an API) before the
 * site goes live, then set `PLACEHOLDER_DATA = false`.
 *
 * While `PLACEHOLDER_DATA` is true the ticker renders a small "sample data"
 * marker in development, so nobody mistakes these for real numbers in review.
 */
export const PLACEHOLDER_DATA = true;

export type TickerStat = {
  /** i18n key under `home.intro.ticker`. */
  key: "policies" | "claims" | "payments" | "documents" | "partners";
  /** Displayed as-is — format for the audience, do not compute in the client. */
  value: string;
};

export const TICKER_STATS: TickerStat[] = [
  { key: "policies", value: "—" },
  { key: "claims", value: "—" },
  { key: "payments", value: "—" },
  { key: "documents", value: "—" },
  { key: "partners", value: "—" },
];

/** Seconds for one full pass. Longer = slower. */
export const TICKER_DURATION_S = 40;
