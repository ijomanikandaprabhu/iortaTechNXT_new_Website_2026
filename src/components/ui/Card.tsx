import type { HTMLAttributes, ReactNode } from "react";

export type CardFamily = "white" | "glass" | "dark";

/** Facet accents. One per card — the type makes "both" unrepresentable. */
export type CardAccent = "green" | "teal";

const ACCENT_VAR: Record<CardAccent, string> = {
  green: "var(--brand-green)",
  teal: "var(--brand-teal)",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  family?: CardFamily;
  /**
   * Sets --card-accent for every <Stat> inside. Scoped to the card precisely
   * so two accents cannot appear in one card.
   */
  accent?: CardAccent;
  children: ReactNode;
};

export function Card({
  family = "white",
  accent,
  className = "",
  style,
  children,
  ...props
}: CardProps) {
  const classes = ["card", `card--${family}`, className].filter(Boolean).join(" ");
  const accentStyle = accent ? { "--card-accent": ACCENT_VAR[accent] } : undefined;

  return (
    <div className={classes} style={{ ...accentStyle, ...style } as React.CSSProperties} {...props}>
      {children}
    </div>
  );
}

/** Uppercase eyebrow label. */
export function CardLabel({ children }: { children: ReactNode }) {
  return <p className="card__label">{children}</p>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="card__title">{children}</h3>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <p className="card__body">{children}</p>;
}

/**
 * A figure. Always tabular-nums so columns of numbers align.
 * Colour comes from the parent Card's accent; it never sets its own.
 */
export function Stat({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div>
      {label && <p className="card__label">{label}</p>}
      <p className="card__stat">{children}</p>
    </div>
  );
}
