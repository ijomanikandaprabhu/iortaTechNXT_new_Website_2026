"use client";

import { Fragment, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Per-character weight "breathing" on a variable font.
 *
 * Requires a face with a `wght` axis — Inter Tight is loaded variable in the
 * root layout for exactly this. On a static instance the property is inert and
 * the text simply sits at its normal weight.
 *
 * Differences from the upstream component, all of them load-bearing:
 *
 * - The keyframes live in CSS, not `<style jsx>`. styled-jsx renames scoped
 *   keyframes, and the upstream animation is declared in an inline `style`
 *   attribute, which styled-jsx never rewrites — so the name never resolves and
 *   the animation does not run at all.
 * - Delays are computed during render from the character index rather than
 *   written to the DOM in an effect, so the wave is correct on first paint
 *   instead of after hydration.
 * - Every character is sized by a hidden copy of itself at the heaviest weight,
 *   which is what keeps the line still. See below.
 * - Reduced motion holds a fixed weight.
 *
 * ## Why each character carries its own sizer
 *
 * Weight changes a glyph's advance. Left alone, the line's width breathes along
 * with it: measured at 9px on this string, so a centred line slid ±4.5px, and
 * once it was large enough to wrap, the break point moved too — the first line
 * held 30 or 31 characters depending on the current weight, so a letter visibly
 * hopped between lines.
 *
 * Sizing each character at the maximum weight and painting the animated copy
 * over it makes every advance constant, so the width, the centring and the wrap
 * points are all fixed regardless of what the animation is doing.
 *
 * Words are grouped and joined by real space text nodes: an unbroken run of
 * inline-blocks offers the browser no break opportunity, so the line could not
 * wrap at all and would simply overflow.
 */
type AnimatedTextProps = {
  text: string;
  /** Weight axis endpoints. Inter Tight's `wght` axis runs 100–900. */
  minWeight?: number;
  maxWeight?: number;
  /** One half-cycle, in seconds. */
  duration?: number;
  /**
   * Seconds of offset per character from the centre outwards. The wave starts
   * mid-line and travels both ways, so keep it small on long strings: at 0.25
   * a 34-character line spreads over ±4s and reads as unrelated flickering.
   */
  stagger?: number;
  className?: string;
};

export function AnimatedText({
  text,
  minWeight = 300,
  maxWeight = 800,
  duration = 1.5,
  stagger = 0.06,
  className,
}: AnimatedTextProps) {
  const centre = text.length / 2;

  /**
   * Lines of words, each word paired with the index its first character has in
   * the whole string — the wave has to run continuously across a hard break,
   * not restart on each line.
   *
   * A newline in the string is an explicit break. Keeping it in the message
   * bundle rather than the component means a translator can move it: the point
   * where a sentence should break is a property of the sentence.
   */
  const lines = useMemo(() => {
    let offset = 0;
    return text.split("\n").map((line) =>
      line.split(" ").map((word) => {
        const entry = { word, offset };
        // +1 for the separator that followed it, space or newline alike.
        offset += word.length + 1;
        return entry;
      }),
    );
  }, [text]);

  return (
    <span
      // The break is a layout instruction, not part of the sentence — screen
      // readers should hear one continuous line.
      aria-label={text.replace(/\n/g, " ")}
      className={cn("breathe", className)}
      style={
        {
          "--breathe-min": minWeight,
          "--breathe-max": maxWeight,
        } as React.CSSProperties
      }
    >
      {lines.map((words, lineIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={lineIndex}>
          {words.map(({ word, offset }, wordIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={wordIndex}>
              <span aria-hidden="true" className="breathe__word">
                {Array.from(word).map((character, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span className="breathe__char" key={index}>
                    {/* Fixes the advance at the heaviest weight. */}
                    <span className="breathe__sizer">{character}</span>

                    <span
                      className="breathe__live"
                      style={{
                        animationDuration: `${duration}s`,
                        // Negative on the leading half, so the wave is already
                        // under way rather than starting at the first character.
                        animationDelay: `${(offset + index - centre) * stagger}s`,
                      }}
                    >
                      {character}
                    </span>
                  </span>
                ))}
              </span>

              {/* A real text node, so the line has somewhere to break. */}
              {wordIndex < words.length - 1 ? " " : null}
            </Fragment>
          ))}

          {lineIndex < lines.length - 1 ? <br aria-hidden="true" /> : null}
        </Fragment>
      ))}
    </span>
  );
}
