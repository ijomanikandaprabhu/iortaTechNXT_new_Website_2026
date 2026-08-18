import Link from "next/link";

export type CardItem = {
  /** Small kicker above the title: category, or a date for news. */
  category?: string;
  title: string;
  summary?: string;
  /** Extra lines under the summary — the customer-story challenge/outcome. */
  detail?: string[];
  /** Absent = the target does not exist yet, so the card is not a link. */
  href?: string;
  cta?: string;
};

/**
 * Card grid behind Insights, News & Events and Customer Stories.
 *
 * A card without `href` renders as a non-interactive article rather than a
 * dead link, the same rule the nav and footer follow. On these pages that is
 * the normal case, not the exception: the spec forbids publishing customer
 * names, quotations and metrics before approval, so the launch stories are
 * listed as planned coverage until each one clears review.
 */
export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <ul className="cards">
      {items.map((item) => {
        const body = (
          <>
            {item.category && <p className="cards__category">{item.category}</p>}
            <h3 className="cards__title">{item.title}</h3>
            {item.summary && <p className="cards__summary">{item.summary}</p>}
            {item.detail?.map((line) => (
              <p className="cards__detail" key={line}>
                {line}
              </p>
            ))}
            {item.href && item.cta && <span className="cards__cta">{item.cta}</span>}
          </>
        );

        return (
          <li className="cards__item" key={item.title}>
            {item.href ? (
              <Link className="cards__link" href={item.href}>
                {body}
              </Link>
            ) : (
              <article className="cards__link cards__link--pending">{body}</article>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The topic filters the spec asks for, rendered as static labels.
 *
 * They are deliberately not interactive yet: there is no article collection to
 * filter, and a control that visibly does nothing is worse than a plain list.
 * They become buttons when the content source exists.
 */
export function FilterList({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="filters">
      <p className="filters__label">{label}</p>
      <ul className="filters__list">
        {items.map((item) => (
          <li className="filters__item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
