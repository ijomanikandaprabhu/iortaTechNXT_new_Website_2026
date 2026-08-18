import Link from "next/link";

/**
 * Self-contained page blocks: role grids, FAQs, proof callouts, the CTA band
 * and related links. Each one owns its whole band, unlike the primitives in
 * `Section.tsx` which are composed inside one.
 */

/**
 * "Built for" and "What changes for the business" — a role paired with what it
 * gets. Both sections in the spec share this shape, so they share a component.
 */
export type RoleItem = { role: string; description: string };

export function RoleGrid({ items }: { items: RoleItem[] }) {
  return (
    <ul className="rolegrid">
      {items.map((item) => (
        <li className="rolegrid__item" key={item.role}>
          <p className="rolegrid__role">{item.role}</p>
          <p className="rolegrid__desc">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * FAQ list built on `<details>` so it opens and closes without JavaScript and
 * stays accessible to keyboard and screen-reader users by default.
 */
export type FaqItem = { question: string; answer: string };

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details className="faq__item" key={item.question}>
          <summary className="faq__q">{item.question}</summary>
          <p className="faq__a">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * "Proof in practice".
 *
 * `pending` marks the block as awaiting an approved customer story and renders
 * a visible placeholder instead of an outcome. The spec is explicit that
 * customer names, metrics and certifications must not be published before
 * approval, so the unapproved state is a first-class prop rather than something
 * an author has to remember to leave blank — the same approach
 * `partners.config.ts` takes with its placeholder flag.
 */
export function ProofBlock({
  body,
  cta,
  pending = false,
  pendingNote,
}: {
  body: string;
  cta?: { label: string; href: string };
  pending?: boolean;
  pendingNote?: string;
}) {
  return (
    <div className="proof">
      <p className="proof__body">{body}</p>

      {pending && pendingNote ? <p className="proof__pending">{pendingNote}</p> : null}

      {cta && !pending ? (
        <Link className="proof__cta" href={cta.href}>
          {cta.label}
          <span aria-hidden="true"> →</span>
        </Link>
      ) : null}
    </div>
  );
}

/**
 * The three-stage conversion band: Explore, Evaluate, Convert.
 *
 * Stages are optional so a page can offer only the actions it can honour —
 * linking "Explore" at a story that has not been approved for publication
 * would be worse than leaving the stage out.
 */
export type CtaAction = { label: string; href: string };

export function CtaBand({
  title,
  explore,
  evaluate,
  convert,
}: {
  title: string;
  explore?: CtaAction;
  evaluate?: CtaAction;
  convert?: CtaAction;
}) {
  return (
    <section className="ctaband">
      <div className="ctaband__inner">
        <h2 className="ctaband__title">{title}</h2>

        <p className="ctaband__actions">
          {convert ? (
            <Link className="btn btn--primary" href={convert.href}>
              {convert.label}
            </Link>
          ) : null}
          {evaluate ? (
            <Link className="btn btn--secondary" href={evaluate.href}>
              {evaluate.label}
            </Link>
          ) : null}
          {explore ? (
            <Link className="ctaband__explore" href={explore.href}>
              {explore.label}
              <span aria-hidden="true"> →</span>
            </Link>
          ) : null}
        </p>
      </div>
    </section>
  );
}

/**
 * "Related thinking" and product cross-links.
 *
 * An item without an `href` renders as plain text. That is deliberate: much of
 * the IA is not built yet, and a link to a page that 404s is worse than a
 * label that does not link — the same rule the home page's bento cells follow.
 */
export type RelatedItem = { label: string; href?: string };

export function RelatedLinks({ items }: { items: RelatedItem[] }) {
  return (
    <ul className="related">
      {items.map((item) => (
        <li className="related__item" key={item.label}>
          {item.href ? (
            <Link className="related__link" href={item.href}>
              {item.label}
              <span aria-hidden="true"> →</span>
            </Link>
          ) : (
            <span className="related__pending">{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
