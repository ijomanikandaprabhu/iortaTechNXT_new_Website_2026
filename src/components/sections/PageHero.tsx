import Link from "next/link";

/**
 * The opening block every content page shares: eyebrow, headline, lede and up
 * to two calls to action.
 *
 * The two CTAs map onto the site's conversion model — the primary is the
 * "convert" action (Request Demo / Talk to Us) and the secondary is an
 * "evaluate" one (Explore Features). Pages that only warrant one may pass one.
 */
export type HeroCta = { label: string; href: string };

export function PageHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  primary?: HeroCta;
  secondary?: HeroCta;
}) {
  return (
    <header className="phero">
      <p className="phero__eyebrow">{eyebrow}</p>
      <h1 className="phero__title">{title}</h1>
      {lede ? <p className="phero__lede">{lede}</p> : null}

      {primary || secondary ? (
        <p className="phero__ctas">
          {primary ? (
            <Link className="btn btn--primary" href={primary.href}>
              {primary.label}
            </Link>
          ) : null}
          {secondary ? (
            <Link className="btn btn--secondary" href={secondary.href}>
              {secondary.label}
            </Link>
          ) : null}
        </p>
      ) : null}
    </header>
  );
}
