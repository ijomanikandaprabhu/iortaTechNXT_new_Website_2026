"use client";

import { useId, useState } from "react";
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
 * The corner control is a real disclosure, not decoration: it expands the card
 * to reveal `detail`. A button that only looked like a control would be worse
 * than none, since it invites a click and answers with nothing.
 */
export type BentoItem = {
  title: string;
  body: string;
  /** Revealed by the corner control. */
  detail: string;
  /** Decorative; the title carries the meaning. */
  icon?: string;
};

type BentoGridProps = {
  items: BentoItem[];
  /** Localised control labels; the card title is appended for context. */
  showLabel: string;
  hideLabel: string;
  className?: string;
};

export function BentoGrid({ items, showLabel, hideLabel, className }: BentoGridProps) {
  // One at a time: two expanded cards in the same row would stretch it twice
  // over and push the artwork out of proportion.
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const baseId = useId();

  return (
    <ul className={cn("bento", className)}>
      {items.map((item) => {
        const open = openTitle === item.title;
        const detailId = `${baseId}-${item.title.replace(/\W+/g, "-")}`;

        return (
          <li className={cn("bento__cell", open && "bento__cell--open")} key={item.title}>
            <button
              aria-controls={detailId}
              aria-expanded={open}
              // The icon alone names nothing, and six identical "Show details"
              // buttons are indistinguishable in a list of controls.
              aria-label={`${open ? hideLabel : showLabel}: ${item.title}`}
              className="bento__expand"
              onClick={() => setOpenTitle(open ? null : item.title)}
              type="button"
            >
              {/*
                Corner brackets, pointing out to expand and back in to collapse.
                Drawn as strokes here rather than lifting the reference's filled
                path data — same glyph, own geometry.
              */}
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path
                  d={open ? "M16 8.25h-3.25V5M5 12.75h3.25V16" : "M12.75 5H16v3.25M8.25 16H5v-3.25"}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                />
              </svg>
            </button>

            <div className="bento__head">
              <h3 className="bento__title">{item.title}</h3>
              <p className="bento__body">{item.body}</p>

              <p className="bento__detail" hidden={!open} id={detailId}>
                {item.detail}
              </p>
            </div>

            <div aria-hidden="true" className="bento__art">
              {item.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="bento__icon" src={item.icon} />
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
