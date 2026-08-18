import { brandAssets, lockupAspectRatio, type LogoVariant } from "@/config/brand.config";
import { getLockupClearspace, resolveLogoSize } from "./logoSize";

type LogoProps = {
  variant?: LogoVariant;
  /** Width for `full`, edge length for square variants. Defaults to the minimum. */
  size?: number;
  /**
   * Accessible name. Pass "" for decorative use where an adjacent text link
   * already names the brand.
   */
  alt?: string;
  /** Apply the mandated clearspace (full lockup only). */
  clearspace?: boolean;
  className?: string;
};

/**
 * Renders the brand mark and enforces the usage rules from the design spec:
 * minimum sizes per variant, and clearspace for the full lockup.
 *
 * Variants are not interchangeable — `icon` is for square/compact contexts
 * (favicons, avatars, app tiles) and must never stand in for the full lockup
 * in a layout that expects the wordmark.
 */
export function Logo({
  variant = "full",
  size,
  alt = "TECHNXT",
  clearspace = false,
  className = "",
}: LogoProps) {
  const { size: resolved, warning } = resolveLogoSize(variant, size);

  // Dev-time only: surfaces misuse without breaking the render or shipping
  // console noise to production.
  if (warning && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(warning);
  }

  const isFull = variant === "full";
  const width = resolved;
  const height = isFull ? Math.round(resolved / lockupAspectRatio) : resolved;

  const style: React.CSSProperties = { width, height };
  if (isFull && clearspace) {
    style.padding = getLockupClearspace(width, lockupAspectRatio);
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brandAssets[variant]}
      alt={alt}
      width={width}
      height={height}
      className={`logo logo--${variant} ${className}`.trim()}
      style={style}
    />
  );
}
