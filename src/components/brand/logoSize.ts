import { logoMinSize, type LogoVariant } from "@/config/brand.config";

export type LogoSizeResult = {
  /** The size actually rendered, after clamping. */
  size: number;
  /** True when the requested size was below the variant's minimum. */
  clamped: boolean;
  /** Populated when clamped, for a dev-time warning. */
  warning?: string;
};

/**
 * Enforces the per-variant minimum size. Pure, so the rule is unit-testable
 * without rendering React.
 *
 * `full` is measured as width; icon and shield variants are square.
 */
export function resolveLogoSize(variant: LogoVariant, requested?: number): LogoSizeResult {
  const min = logoMinSize[variant];

  if (requested === undefined) return { size: min, clamped: false };

  if (!Number.isFinite(requested) || requested <= 0) {
    return {
      size: min,
      clamped: true,
      warning: `<Logo variant="${variant}"> received an invalid size (${requested}); using the ${min}px minimum.`,
    };
  }

  if (requested < min) {
    const dimension = variant === "full" ? "width" : "size";
    return {
      size: min,
      clamped: true,
      warning: `<Logo variant="${variant}"> requested ${dimension} ${requested}px but the minimum is ${min}px. Clamped to ${min}px — below this the facet lines blur together.`,
    };
  }

  return { size: requested, clamped: false };
}

/**
 * Clearspace for the full lockup equals the height of the icon on all sides.
 * The icon is as tall as the lockup, so height = width / aspect ratio.
 */
export function getLockupClearspace(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio);
}
