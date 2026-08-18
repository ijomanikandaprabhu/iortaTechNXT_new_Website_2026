/**
 * Client logos for the home page logo cloud.
 *
 * Names were read from the artwork itself, not the filenames — several arrived
 * as "image 412.png" and similar. Check them against your own records before
 * launch: `alt` text on a client logo is a public statement about who you work
 * with, and it is what screen readers announce.
 *
 * Two identical PhilLife files were supplied ("pngwing.com 1" and
 * "pngwing.com2 1"); the duplicate was dropped.
 */
export const PARTNERS_ARE_PLACEHOLDERS = false;

export type PartnerLogo = {
  src: string;
  alt: string;
};

export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/brand/partners/chubb.png", alt: "Chubb" },
  { src: "/brand/partners/aviva.png", alt: "Aviva" },
  { src: "/brand/partners/liberty-mutual.png", alt: "Liberty Mutual Insurance" },
  { src: "/brand/partners/tata-aig.png", alt: "Tata AIG" },
  { src: "/brand/partners/icare.png", alt: "iCare" },
  { src: "/brand/partners/pga-sompo.png", alt: "PGA Sompo Insurance Corporation" },
  { src: "/brand/partners/edelweiss-tokio-life.png", alt: "Edelweiss Tokio Life" },
  { src: "/brand/partners/star-union-dai-ichi.png", alt: "Star Union Dai-ichi Life Insurance" },
  { src: "/brand/partners/mirae-asset-prevoir.png", alt: "Mirae Asset Prévoir Life Insurance" },
  { src: "/brand/partners/fubon-insurance.png", alt: "Fubon Insurance" },
  { src: "/brand/partners/phillife-financial.png", alt: "PhilLife Financial" },
  { src: "/brand/partners/takaful-ikhlas.png", alt: "Takaful IKHLAS" },
  { src: "/brand/partners/pramerica.png", alt: "Pramerica" },
  { src: "/brand/partners/infinity-insurance.png", alt: "Infinity Insurance" },
  { src: "/brand/partners/lion-insurance.png", alt: "Lion Insurance Company (S.C.)" },
];

/** Cells shown at once. */
export const PARTNER_VISIBLE = 12;
/** How long each set holds before the next shuffle, in ms. */
export const PARTNER_INTERVAL_MS = 3000;
/**
 * Cells replaced per tick. Swapping all eight at once blanks the whole panel
 * while the new marks fade in; a couple at a time reads as a shuffle.
 */
export const PARTNER_SWAP_PER_TICK = 2;

/**
 * ⚠ The featured card's headline figure is a placeholder ("—") in the message
 * bundle. Put a real, verifiable number there before launch, or drop the card:
 * a stat next to client logos reads as a claim about those clients.
 */
