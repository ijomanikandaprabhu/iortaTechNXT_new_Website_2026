/**
 * Order of the headline rotation. Keys map to `home.intro.rotate`.
 *
 * The animation itself now lives in components/ui/TextLoop.tsx — this file
 * keeps only the sequence so the order stays in the feature it belongs to.
 */
export const ROTATE_KEYS = [
  "insurance",
  "distribution",
  "cx",
  "claims",
  "embedded",
  "brokerage",
  "ecosystems",
] as const;
