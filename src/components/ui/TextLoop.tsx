"use client";

import React, { useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Width-reveal text loop with a blinking cursor.
 *
 * Adapted from the upstream shadcn-style component for this codebase:
 *  - imports from `framer-motion` (installed) rather than `motion/react`;
 *    same library, and adding both would ship it twice
 *  - Tailwind utilities replaced with project CSS classes, since this project
 *    uses design tokens rather than Tailwind
 *  - violet palette swapped for the TECHNXT blue family
 *
 * The className props are kept so call sites can still override per instance.
 */
interface TextLoopProps {
  staticText?: string;
  rotatingTexts?: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  staticTextClassName?: string;
  rotatingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
  /** Accessible sentence; the animated part is hidden from assistive tech. */
  ariaLabel?: string;
}

export default function TextLoop({
  staticText = "Design",
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 3000,
  transition = { duration: 0.8, ease: "easeInOut" },
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
  ariaLabel,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Holding on one phrase is the correct reduced-motion behaviour here: the
  // effect is the movement, so there is nothing meaningful to slow down.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [rotatingTexts.length, interval, reduced]);

  return (
    <LazyMotion features={domAnimation}>
      <span className={cn("textloop", className)} aria-label={ariaLabel} role="text">
        <span className={cn("textloop__static", staticTextClassName)}>{staticText}</span>

        <span className="textloop__slot" aria-hidden="true">
          <AnimatePresence mode="wait">
            <m.span
              key={rotatingTexts[index]}
              className="textloop__reveal"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={reduced ? { duration: 0 } : transition}
            >
              <span className={cn("textloop__bg", backgroundClassName)} />
              <span className={cn("textloop__word", rotatingTextClassName)}>
                {rotatingTexts[index]}
              </span>
            </m.span>
          </AnimatePresence>

          <m.span
            className={cn("textloop__cursor", cursorClassName)}
            animate={reduced ? { opacity: 1 } : { opacity: [1, 0.4] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
            }
          />
        </span>
      </span>
    </LazyMotion>
  );
}
