import { getTranslations } from "next-intl/server";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { FloatingIcons, type FloatingIcon } from "@/components/ui/FloatingIcons";
import type { Locale } from "@/core/i18n/config";
import { CAPABILITIES, ICON_DIR, ICON_EXT } from "@/features/hero/capabilities";

/**
 * Coordinates for the field, as % of the section. Ordered to match
 * CAPABILITIES. They ring the centre and leave the middle band clear so the
 * copy never sits on top of a tile.
 *
 * The full 0–100 range is usable: the field is inset by half a tile plus the
 * drift, so an edge coordinate still sits inside the section at any width. What
 * these values control is spacing, not safety.
 *
 * The rows above and below the copy do have to clear it, and the copy is
 * vertically centred, so they sit at the extremes rather than near the middle.
 */
const POSITIONS: Array<Pick<FloatingIcon, "x" | "y">> = [
  { x: 0, y: 14 },
  { x: 22, y: 3 },
  { x: 50, y: 0 },
  { x: 78, y: 3 },
  { x: 100, y: 15 },
  { x: 0, y: 47 },
  { x: 100, y: 50 },
  { x: 0, y: 84 },
  { x: 24, y: 98 },
  { x: 50, y: 100 },
  { x: 76, y: 97 },
  { x: 100, y: 83 },
];

/**
 * Fourth band: the capability set drifting around the platform statement.
 *
 * Server component; the field itself is a client island. The icons are the
 * project's own capability set — the same twelve that fan out in the hero —
 * rather than third-party company logos.
 */
export async function PlatformSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.platform" });
  const capabilityNames = await getTranslations({
    locale,
    namespace: "home.sequence.capabilities",
  });

  const icons: FloatingIcon[] = CAPABILITIES.map((capability, index) => ({
    src: `${ICON_DIR}/${capability.slug}.${ICON_EXT}`,
    alt: capabilityNames(capability.slug),
    ...POSITIONS[index]!,
  }));

  return (
    <section className="platform" aria-labelledby="platform-title">
      <FloatingIcons icons={icons}>
        <p className="platform__lead">{t("lead")}</p>
        <p className="platform__sub">{t("problem")}</p>

        {/*
          The heading is this line, not the opening one. The lead sets up the
          situation; this is the section's actual claim, and it is what the
          layout already treats as the focal point. Its accessible name comes
          from AnimatedText's aria-label, so the per-character markup does not
          leak into the heading text.
        */}
        <h2 className="platform__connect" id="platform-title">
          {/* Slow: one half-cycle every 3.5s, so the line breathes rather than
              pulses. The stagger widens with it to keep the wave coherent. */}
          <AnimatedText duration={3.5} stagger={0.09} text={t("connect")} />
        </h2>
        <p className="platform__sub">{t("build")}</p>
      </FloatingIcons>

      {/* The field is aria-hidden, so the capability names still need to reach
          assistive tech and crawlers somewhere. */}
      <ul className="u-visually-hidden">
        {CAPABILITIES.map((capability) => (
          <li key={capability.slug}>{capabilityNames(capability.slug)}</li>
        ))}
      </ul>
    </section>
  );
}
