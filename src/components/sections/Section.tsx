import { cn } from "@/lib/utils";

/**
 * Structural content primitives shared by every page template.
 *
 * Grouped in one file the way `Card.tsx` groups its parts: these are small
 * pieces that are almost always used together inside a `Section`, and splitting
 * them across five files would make the templates harder to read, not easier.
 */

/**
 * One band of a page.
 *
 * `number` renders the "01 · LABEL" eyebrow the Features, Solutions and
 * Capabilities pages are specified around; omit it for pages that read as prose
 * rather than an enumerated list.
 *
 * The separator is a middle dot, not an em dash. This one line was generating
 * 30 of the 31 em dashes on the site, against the standing preference to keep
 * them out of the copy.
 */
/** Same four-role shape as PageHero's tint (see brand.config.ts). */
export type SectionTint = { primary: string; primaryStrong: string; supporting: string; dark: string };

export type SectionTone = "default" | "muted" | "dark";

/**
 * The site-wide band rhythm: two light bands, then one dark, repeating.
 *
 * Every page template runs its bands through this rather than choosing tones by
 * hand, so the cadence is identical across products, solutions, industries,
 * capabilities and the rest — and stays that way when a page gains or loses a
 * section. `index` counts Sections only, from 0, starting after the page hero.
 *
 * The two light bands alternate `default` and `muted` so a pair never reads as
 * one long block; only the third band inverts.
 */
export function bandTone(index: number): SectionTone {
  const position = index % 3;
  if (position === 2) return "dark";
  return position === 1 ? "muted" : "default";
}

export function Section({
  id,
  number,
  eyebrow,
  title,
  lede,
  tone = "default",
  tint,
  children,
}: {
  id?: string;
  number?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** `muted` tints the band; `dark` inverts it. Both run full-bleed. */
  tone?: "default" | "muted" | "dark";
  /**
   * Product brand palette, for product pages only. Set once here as CSS
   * custom properties; every descendant (RoleGrid, TagList, JourneySteps,
   * FaqList, ProofBlock...) picks them up through inheritance rather than
   * each needing its own tint prop.
   */
  tint?: SectionTint;
  children?: React.ReactNode;
}) {
  const label = [number, eyebrow].filter(Boolean).join(" · ");

  return (
    <section
      className={cn("sec", tone !== "default" && `sec--${tone}`, tint && "sec--tinted")}
      id={id}
      style={
        tint
          ? ({
              "--product-primary": tint.primary,
              "--product-primary-strong": tint.primaryStrong,
              "--product-supporting": tint.supporting,
              "--product-dark": tint.dark,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="sec__inner">
        {label ? <p className="sec__label">{label}</p> : null}
        {title ? <h2 className="sec__title">{title}</h2> : null}
        {lede ? <p className="sec__lede">{lede}</p> : null}
        {children ? <div className="sec__body">{children}</div> : null}
      </div>
    </section>
  );
}

/** A run of body paragraphs at a readable measure. */
export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose">
      {paragraphs.map((paragraph) => (
        <p className="prose__p" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/**
 * Bold term plus explanation. This is the shape the Features pages use
 * throughout, so it is a description list rather than a generic card grid —
 * the semantics are the point.
 */
export type FeatureItem = { term: string; description: string };

export function FeatureList({ items }: { items: FeatureItem[] }) {
  return (
    <dl className="featlist">
      {items.map((item) => (
        <div className="featlist__row" key={item.term}>
          <dt className="featlist__term">{item.term}</dt>
          <dd className="featlist__desc">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The comma-separated capability runs the spec uses for integration and
 * control surfaces, rendered as chips so they scan instead of forming a wall
 * of prose.
 */
export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="taglist">
      {items.map((item) => (
        <li className="taglist__item" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A linear journey — "Capture → Prioritize → Engage".
 *
 * The arrows are decorative and generated in CSS, so the steps read as a plain
 * ordered list to assistive tech rather than as text peppered with arrows.
 */
export function JourneySteps({ steps }: { steps: string[] }) {
  return (
    <ol className="journey">
      {steps.map((step) => (
        <li className="journey__step" key={step}>
          {step}
        </li>
      ))}
    </ol>
  );
}
