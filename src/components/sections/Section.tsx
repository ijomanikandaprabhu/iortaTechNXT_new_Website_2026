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
export function Section({
  id,
  number,
  eyebrow,
  title,
  lede,
  tone = "default",
  children,
}: {
  id?: string;
  number?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** `muted` tints the band; `dark` inverts it. Both run full-bleed. */
  tone?: "default" | "muted" | "dark";
  children?: React.ReactNode;
}) {
  const label = [number, eyebrow].filter(Boolean).join(" · ");

  return (
    <section className={cn("sec", tone !== "default" && `sec--${tone}`)} id={id}>
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
