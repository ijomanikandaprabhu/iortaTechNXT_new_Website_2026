import { cn } from "@/lib/utils";

/**
 * Logo grid.
 *
 * Adapted from the upstream shadcn-style component for this codebase: the
 * Tailwind utilities are replaced with project CSS classes, since this project
 * uses design tokens rather than Tailwind. The API is unchanged.
 *
 * The grid gap is the container's own background showing through the tiles,
 * which is how the original produces its hairline rule between cells.
 */
type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ logos, className, ...props }: LogoCloudProps) {
  return (
    <div className={cn("logocloud", className)} {...props}>
      {logos.map((logo, index) => (
        /**
         * Keyed by position *and* source, not by `alt` alone. A rotating cloud
         * can briefly hold the same mark in two cells; identical keys made
         * React leave orphan nodes behind — 14 cells rendered for 12 slots,
         * which also threw off the :nth-child rules that place the grid stars.
         *
         * The src half still matters: it changes when a cell swaps, so the cell
         * remounts and replays the fade.
         */
        <div className="logocloud__cell" key={`${index}:${logo.src}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={logo.alt}
            className="logocloud__img"
            height={logo.height ?? undefined}
            loading="lazy"
            src={logo.src}
            width={logo.width ?? undefined}
          />
        </div>
      ))}
    </div>
  );
}
