import type { ButtonHTMLAttributes } from "react";

/**
 * Deliberately no "success"/green variant. Green is reserved for positive
 * financial state, so a user can never confuse "click here" with "you made
 * money". Use <Stat accent="green"> for that instead.
 */
export type ButtonVariant = "primary" | "secondary" | "accent";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Force the pill radius on secondary/accent (primary is always a pill). */
  pill?: boolean;
};

export function Button({
  variant = "primary",
  pill = false,
  className = "",
  disabled,
  ...props
}: Props) {
  const classes = ["btn", `btn--${variant}`, pill ? "btn--pill" : "", className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} disabled={disabled} {...props} />;
}
