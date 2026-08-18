import { getTranslations } from "next-intl/server";
import { LoopingWords } from "@/components/ui/LoopingWords";
import type { Locale } from "@/core/i18n/config";

/**
 * Third band: a single rotating statement in a bracket selector.
 *
 * Server component; only the animation itself is a client island. All three
 * phrases are in the markup as a list, so the section reads as real content to
 * crawlers and assistive tech even though one shows at a time.
 */
export async function PossibilitiesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.possibilities" });
  const words = t.raw("words") as string[];

  return (
    <section className="loopwords" aria-labelledby="possibilities-title">
      <div className="loopwords__inner">
        <h2 className="loopwords__eyebrow" id="possibilities-title">
          {t("eyebrow")}
        </h2>

        <LoopingWords words={words} />
      </div>
    </section>
  );
}
