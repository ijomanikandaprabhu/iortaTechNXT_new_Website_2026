"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type Action = { label: string; href: string };

export type BentoPanel = {
  title: string;
  lede: string;
  points: string[];
  features: { title: string; body: string }[];
  /** Onward links, matching the reference's "More to discover" row. */
  more: { label: string; body: string; href: string }[];
  primary: Action;
  secondary: Action;
  /**
   * Customer proof. Placeholder until a statement is approved for public use,
   * and labelled as such on the page so it cannot be mistaken for a real one.
   */
  quote: { badge: string; text: string; name: string; org: string; cta: string };
  /** The closing band: "Get started with <product>". */
  getStarted: { title: string; primary: Action; secondary: Action };
  /** Decorative; the heading carries the meaning. */
  icon?: string;
};

/**
 * The expanded view behind a bento cell.
 *
 * Built on a native <dialog> opened with showModal(), which gives focus
 * trapping, Escape-to-close, the top layer and background inerting from the
 * platform rather than from several hundred lines of our own. The only things
 * left to add are closing on a backdrop click and restoring page scroll.
 */
export function BentoModal({
  panel,
  open,
  onClose,
  closeLabel,
  moreTitle,
}: {
  panel: BentoPanel | null;
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  moreTitle: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /**
   * Escape fires the dialog's own `cancel`, which would close the element
   * without telling React. Listening for `close` keeps the two in step however
   * it was dismissed.
   */
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const sync = () => onClose();
    dialog.addEventListener("close", sync);
    return () => dialog.removeEventListener("close", sync);
  }, [onClose]);

  // The dialog is in the top layer, so the page behind can still scroll under
  // it unless we say otherwise.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      className="bentomodal"
      ref={ref}
      // The backdrop is part of the dialog's own box, so a click that lands on
      // the element itself rather than on the inner panel is a backdrop click.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {panel && (
        <div className="bentomodal__panel">
          <button
            aria-label={`${closeLabel}: ${panel.title}`}
            className="bentomodal__close"
            onClick={onClose}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path
                d="M6 6l8 8M14 6l-8 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
          </button>

          <div className="bentomodal__head">
            <div className="bentomodal__intro">
              <h2 className="bentomodal__title">{panel.title}</h2>
              <p className="bentomodal__lede">{panel.lede}</p>

              <p className="bentomodal__actions">
                <Link className="btn btn--primary" href={panel.primary.href}>
                  {panel.primary.label}
                </Link>
                <Link className="btn btn--secondary" href={panel.secondary.href}>
                  {panel.secondary.label}
                </Link>
              </p>
            </div>

            <ul className="bentomodal__points">
              {panel.points.map((point) => (
                <li className="bentomodal__point" key={point}>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                    <path
                      d="M5 8.2l2 2L11 6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stands in for the product imagery the reference shows here. Kept
              deliberately abstract rather than a mocked-up interface, which
              would read as a screenshot of something that does not exist. */}
          <div aria-hidden="true" className="bentomodal__art">
            <div className="bentomodal__artcell bentomodal__artcell--wide">
              {panel.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="bentomodal__icon" src={panel.icon} />
              ) : null}
            </div>
            <div className="bentomodal__artcell" />
            <div className="bentomodal__artcell" />
          </div>

          <ul className="bentomodal__features">
            {panel.features.map((feature) => (
              <li className="bentomodal__feature" key={feature.title}>
                <span aria-hidden="true" className="bentomodal__featureicon">
                  {panel.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" src={panel.icon} />
                  ) : null}
                </span>
                {/* The reference runs this as one block of small text under the
                    icon rather than a heading and paragraph, so the term is
                    emphasis inside the sentence, not a separate line. */}
                <p className="bentomodal__featurebody">
                  <strong className="bentomodal__featureterm">{feature.title}.</strong>{" "}
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="bentomodal__more">
            <h3 className="bentomodal__moretitle">{moreTitle}</h3>
            <ul className="bentomodal__morelist">
              {panel.more.map((item) => (
                <li className="bentomodal__moreitem" key={item.href}>
                  <span aria-hidden="true" className="bentomodal__moreart" />
                  <p className="bentomodal__morebody">{item.body}</p>
                  <Link className="bentomodal__morelink" href={item.href}>
                    {item.label}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <figure className="bentomodal__quote">
            <p className="bentomodal__quotebadge">{panel.quote.badge}</p>
            <blockquote className="bentomodal__quotetext">{panel.quote.text}</blockquote>
            <figcaption className="bentomodal__quoteby">
              <strong>{panel.quote.name}</strong>, {panel.quote.org}
            </figcaption>
            {/* Intentionally not a link: there is no story to read yet. */}
            <p className="bentomodal__quotecta">{panel.quote.cta}</p>
          </figure>

          <div className="bentomodal__start">
            <h3 className="bentomodal__starttitle">{panel.getStarted.title}</h3>
            <p className="bentomodal__actions bentomodal__actions--center">
              <Link className="btn btn--primary" href={panel.getStarted.primary.href}>
                {panel.getStarted.primary.label}
              </Link>
              <Link className="btn btn--secondary" href={panel.getStarted.secondary.href}>
                {panel.getStarted.secondary.label}
              </Link>
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}
