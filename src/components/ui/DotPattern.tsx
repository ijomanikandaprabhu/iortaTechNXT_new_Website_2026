import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Tiling dot field rendered as an SVG pattern.
 *
 * Adapted from the upstream shadcn-style component for this codebase: the
 * Tailwind utilities (`pointer-events-none absolute inset-0 h-full w-full
 * fill-neutral-400/80`) are replaced by the `.dotpattern` class, since this
 * project uses design tokens rather than Tailwind. The API is unchanged.
 */
interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  [key: string]: unknown;
}

function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg aria-hidden="true" className={cn("dotpattern", className)} {...props}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export { DotPattern };
