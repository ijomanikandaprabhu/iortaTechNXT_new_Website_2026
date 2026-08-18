import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Button whose label is wiped left to right in a glowing accent on hover.
 *
 * Two stacked copies of the same label: the base sits in normal ink, and an
 * accent copy is clipped to zero width on top of it. Hover animates that clip
 * open, so the accent appears to sweep across the word.
 *
 * The upstream snippet arrived with `class` instead of `className`, an unused
 * `useState`, a `data-text` that did not match its content, and — critically —
 * no stylesheet, which is where the entire effect lives. Only the two-span
 * structure survives from it; the effect is in glowbutton.css.
 *
 * Renders an anchor when `href` is given so it keeps working as navigation. A
 * <button> would look identical and go nowhere.
 */
type SlideGlowButtonProps = {
  children: string;
  href?: string;
  className?: string;
};

export function SlideGlowButton({ children, href, className }: SlideGlowButtonProps) {
  const content = (
    <>
      <span className="glowbtn__base">{children}</span>

      {/* The clipped copy. Hidden from assistive tech: it is the same word
          again, and a screen reader would otherwise announce it twice. */}
      <span aria-hidden="true" className="glowbtn__wipe">
        {children}
      </span>

      {/* The bar that leads the sweep across. */}
      <span aria-hidden="true" className="glowbtn__caret" />
    </>
  );

  // Named explicitly rather than leaning on name-from-content. The label exists
  // twice in the markup, one copy aria-hidden, and that is exactly the shape
  // where name computation varies between engines — an explicit label matching
  // the visible text removes the question.
  if (href) {
    return (
      <Link aria-label={children} className={cn("glowbtn", className)} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button aria-label={children} className={cn("glowbtn", className)} type="button">
      {content}
    </button>
  );
}
