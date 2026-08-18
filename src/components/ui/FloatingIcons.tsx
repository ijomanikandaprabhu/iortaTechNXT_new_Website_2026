"use client";

import { useCallback, useEffect, useRef } from "react";
import { LazyMotion, domAnimation, m, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Field of icons that drift on their own and shy away from the cursor.
 *
 * Two things differ from the upstream component, both for performance:
 *
 * 1. One pointer listener for the whole field, not one per icon. Upstream
 *    attached a `mousemove` handler per icon and called `getBoundingClientRect`
 *    inside each — sixteen forced layouts on every pointer event.
 * 2. Positions are cached from `offsetLeft`/`offsetTop`, which are layout
 *    values and so unaffected by the transforms this component applies. Reading
 *    a rect that includes your own transform is circular: the repel offset
 *    feeds back into the distance that produced it.
 *
 * The float durations come from the index rather than `Math.random()`, so a
 * given icon animates identically on every render.
 */

export type FloatingIcon = {
  src: string;
  alt: string;
  /**
   * Position of the icon's centre, in % of the field. The field is inset by
   * half a tile, so 0 and 100 are both fully inside the section.
   */
  x: number;
  y: number;
};

/** Cursor distance at which repulsion starts, in px. */
const INFLUENCE = 150;
/** Maximum push at zero distance, in px. */
const MAX_PUSH = 50;
/**
 * How far the visible tile can extend past its wrapper's box, in px.
 *
 * Two contributions, both invisible to `getBoundingClientRect` on the wrapper:
 * the idle drift (±8px), and the 5° rotation, which widens an 80px tile's
 * bounding box to 87px — about 3.5px per side. Measuring the wrapper alone
 * says every icon is inside while the tile itself is being clipped.
 */
const EDGE_PAD = 14;

type Registration = {
  el: HTMLElement;
  apply: (dx: number, dy: number) => void;
};

export function FloatingIcons({
  icons,
  className,
  children,
}: {
  icons: FloatingIcon[];
  className?: string;
  children?: React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const registry = useRef<Registration[]>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const frame = useRef(0);

  const register = useCallback((entry: Registration) => {
    registry.current.push(entry);
    return () => {
      registry.current = registry.current.filter((e) => e !== entry);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const settle = () => {
      frame.current = 0;
      const hostRect = host.getBoundingClientRect();
      const { x: px, y: py, active } = pointer.current;

      for (const { el, apply } of registry.current) {
        if (!active) {
          apply(0, 0);
          continue;
        }

        // Layout position, so the icon's own transform never feeds back in.
        const cx = hostRect.left + el.offsetLeft + el.offsetWidth / 2;
        const cy = hostRect.top + el.offsetTop + el.offsetHeight / 2;
        const dx = px - cx;
        const dy = py - cy;
        const distance = Math.hypot(dx, dy);

        if (distance >= INFLUENCE || distance === 0) {
          apply(0, 0);
          continue;
        }

        const force = (1 - distance / INFLUENCE) * MAX_PUSH;

        // The push can exceed the field's inset, so clamp the result to keep
        // the tile inside the section — otherwise a cursor beside an edge icon
        // shoves it under the section's `overflow: hidden` and slices it.
        const halfW = el.offsetWidth / 2;
        const halfH = el.offsetHeight / 2;
        const clamp = (value: number, min: number, max: number) =>
          Math.min(Math.max(value, min), max);

        apply(
          clamp(
            (-dx / distance) * force,
            hostRect.left + halfW + EDGE_PAD - cx,
            hostRect.right - halfW - EDGE_PAD - cx,
          ),
          clamp(
            (-dy / distance) * force,
            hostRect.top + halfH + EDGE_PAD - cy,
            hostRect.bottom - halfH - EDGE_PAD - cy,
          ),
        );
      }
    };

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(settle);
    };

    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY, active: true };
      schedule();
    };

    const onLeave = () => {
      pointer.current.active = false;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className={cn("floaticons", className)} ref={hostRef}>
        <div className="floaticons__field" aria-hidden="true">
          {icons.map((icon, index) => (
            <FloatingIconItem icon={icon} index={index} key={icon.src} register={register} />
          ))}
        </div>

        <div className="floaticons__content">{children}</div>
      </div>
    </LazyMotion>
  );
}

function FloatingIconItem({
  icon,
  index,
  register,
}: {
  icon: FloatingIcon;
  index: number;
  register: (entry: Registration) => () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register({
      el,
      apply: (dx, dy) => {
        x.set(dx);
        y.set(dy);
      },
    });
  }, [register, x, y]);

  // Spread the drift so the field never pulses in unison, without randomness
  // that would differ between renders.
  const drift = 5 + (index % 5);

  return (
    <m.div
      className="floaticons__icon"
      ref={ref}
      style={{ x: springX, y: springY, left: `${icon.x}%`, top: `${icon.y}%` }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <m.div
        className="floaticons__tile"
        animate={{ y: [0, -8, 0, 8, 0], x: [0, 6, 0, -6, 0], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: drift, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={icon.alt} className="floaticons__img" src={icon.src} />
      </m.div>
    </m.div>
  );
}
