"use client";

import { useState } from "react";
import Link from "next/link";
import { BentoModal, type BentoPanel } from "@/components/ui/BentoModal";
import { cn } from "@/lib/utils";

/**
 * Bento grid: a fixed six-cell arrangement of mixed widths.
 *
 * Placement is not a prop. The layout is a named grid in CSS — `a` through `f`,
 * assigned by position — so the cells rearrange at each breakpoint without the
 * caller restating the geometry, and there is exactly one place to change it.
 * That does mean the count is fixed at six: the areas are declared, not
 * generated.
 *
 * Each cell is a title over an artwork panel. The panel is a CSS gradient with
 * the domain's icon in it, standing in for the product imagery it will
 * eventually hold — deliberately abstract rather than a mocked-up interface,
 * which would read as a screenshot of something that does not exist.
 *
 * The corner control opens the cell's expanded view in a modal. It replaced an
 * inline disclosure: the panel carries a lede, outcome points, two calls to
 * action, feature blurbs and onward links, which is far more than a card can
 * hold without wrecking the grid's proportions.
 */
export type BentoItem = {
  title: string;
  body: string;
  /** Opened by the corner control. */
  panel: BentoPanel;
  /** Decorative; the title carries the meaning. */
  icon?: string;
  /** Absent = the cell is a plain panel, as it was before the pages existed. */
  href?: string;
  /**
   * The product's brand palette, carried into CSS as custom properties.
   * Optional so a grid without brand colours still renders on the default
   * wash.
   */
  tint?: { primary: string; supporting: string; dark: string };
};

type BentoGridProps = {
  items: BentoItem[];
  /** Localised control labels; the card title is appended for context. */
  showLabel: string;
  closeLabel: string;
  moreTitle: string;
  className?: string;
};

export function BentoGrid({
  items,
  showLabel,
  closeLabel,
  moreTitle,
  className,
}: BentoGridProps) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const active = items.find((item) => item.title === openTitle) ?? null;

  return (
    <>
      <ul className={cn("bento", className)}>
        {items.map((item) => (
          <li
            className="bento__cell"
            key={item.title}
            // Colour is bound to the product, not to the grid slot. It used to
            // be six `nth-child` overrides, so reordering CELLS silently
            // reassigned washes.
            style={
              item.tint
                ? ({
                    "--product-primary": item.tint.primary,
                    "--product-supporting": item.tint.supporting,
                    "--product-dark": item.tint.dark,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <button
              aria-haspopup="dialog"
              // The icon alone names nothing, and six identical "Show details"
              // buttons are indistinguishable in a list of controls.
              aria-label={`${showLabel}: ${item.title}`}
              className="bento__expand"
              onClick={() => setOpenTitle(item.title)}
              type="button"
            >
              {/*
                Corner brackets pointing outward, the reference's expand glyph.
                Drawn as strokes here rather than lifting its filled path data.
              */}
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path
                  d="M12.75 5H16v3.25M8.25 16H5v-3.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                />
              </svg>
            </button>

            <div className="bento__head">
              <h3 className="bento__title">
                {/*
                  The link wraps only the title, not the cell. A card-wide
                  anchor would swallow the expand button nested inside it, and
                  `::after` stretches the hit area back over the whole cell so
                  it still behaves like one clickable card.
                */}
                {item.href ? (
                  <Link className="bento__link" href={item.href}>
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="bento__body">{item.body}</p>
            </div>

            <div aria-hidden="true" className="bento__art">
              {item.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="bento__icon" src={item.icon} />
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <BentoModal
        closeLabel={closeLabel}
        moreTitle={moreTitle}
        onClose={() => setOpenTitle(null)}
        open={Boolean(active)}
        panel={active?.panel ?? null}
      />
    </>
  );
}
