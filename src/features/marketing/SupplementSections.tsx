import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FeatureList, Section, TagList, type FeatureItem } from "@/components/sections/Section";
import { ProofBlock } from "@/components/sections/Blocks";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import {
  STANDALONE_PATHS,
  capabilityPath,
  resourcePath,
  solutionPath,
  technologyPath,
} from "@/config/site.config";

/**
 * Sections 04–12 of the site spec: the homepage narrative after the Verse
 * ecosystem grid, none of which had a home yet.
 *
 * Placeholder scaffold — built entirely from the existing content-page
 * primitives (`Section`, `FeatureList`, `TagList`, `ProofBlock`) rather than
 * new bespoke components, since the goal here is to get the copy on the page
 * in the right order, not to design nine new bands. Each one is a candidate
 * for its own visual treatment later.
 */
export async function SupplementSections({ locale }: { locale: Locale }) {
  const localize = (path: string) => getLocalizedPath(path, locale);

  const tWhy = await getTranslations({ locale, namespace: "home.why" });
  const tOperating = await getTranslations({ locale, namespace: "home.operatingModel" });
  const tPriorities = await getTranslations({ locale, namespace: "home.transformationPriorities" });
  const tOps = await getTranslations({ locale, namespace: "home.intelligentOps" });
  const tTech = await getTranslations({ locale, namespace: "home.techFoundation" });
  const tRegional = await getTranslations({ locale, namespace: "home.regionalReality" });
  const tProof = await getTranslations({ locale, namespace: "home.customerProofSection" });
  const tInsights = await getTranslations({ locale, namespace: "home.insightsSection" });
  const tAia = await getTranslations({ locale, namespace: "home.automationIntelligence" });
  const tClosing = await getTranslations({ locale, namespace: "home.closingCta" });

  const whyItems = tWhy.raw("items") as FeatureItem[];
  const capabilityStrip = tWhy.raw("capabilityStrip") as string[];
  const changing = tOperating.raw("changing") as FeatureItem[];
  const improve = tOperating.raw("improve") as FeatureItem[];
  const opsSteps = tOps.raw("steps") as FeatureItem[];
  const regionalItems = tRegional.raw("items") as FeatureItem[];
  const proofBeats = tProof.raw("beats") as FeatureItem[];
  const insightsItems = tInsights.raw("items") as FeatureItem[];

  const priorityKeys = [
    "distribution-modernization",
    "underwriting-modernization",
    "core-modernization",
    "digital-insurance-takaful",
  ] as const;

  const techGroups = ["connect", "control", "change", "trust"] as const;

  return (
    <>
      {/* 04 — Why Iorta TechNXT */}
      <Section eyebrow={tWhy("eyebrow")} title={tWhy("title")} tone="dark">
        <FeatureList items={whyItems} />
        <div className="supplement__gap">
          <TagList items={capabilityStrip} />
        </div>
      </Section>

      {/* 05 — The operating model + productivity shift */}
      <Section eyebrow={tOperating("eyebrow")} lede={tOperating("lede")} title={tOperating("title")} tone="muted">
        <p className="sec__label">{tOperating("changingLabel")}</p>
        <div className="supplement__gap">
          <FeatureList items={changing} />
        </div>
      </Section>

      <Section eyebrow={tOperating("improveLabel")} title={tOperating("improveTitle")}>
        <FeatureList items={improve} />
      </Section>

      {/* 06 — Solutions: four transformation priorities */}
      <Section eyebrow={tPriorities("eyebrow")} title={tPriorities("title")} tone="dark">
        <ul className="rolegrid">
          {priorityKeys.map((key) => (
            <li className="rolegrid__item" key={key}>
              <p className="rolegrid__role">{tPriorities(`cards.${key}.title`)}</p>
              <p className="rolegrid__desc">
                <strong>{tPriorities(`cards.${key}.lede`)}</strong> {tPriorities(`cards.${key}.body`)}
              </p>
              <Link className="related__link" href={localize(solutionPath(key))}>
                {tPriorities(`cards.${key}.cta`)}
                <span aria-hidden="true"> →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 07 — Intelligent operations */}
      <Section eyebrow={tOps("eyebrow")} lede={tOps("lede")} title={tOps("title")}>
        <FeatureList items={opsSteps} />
        <p className="supplement__gap sec__label">{tOps("supportingLine")}</p>
        <Link className="related__link" href={localize(capabilityPath("intelligent-operations-decisioning"))}>
          {tOps("cta")}
          <span aria-hidden="true"> →</span>
        </Link>
      </Section>

      {/* 08 — Technology foundation */}
      <Section eyebrow={tTech("eyebrow")} lede={tTech("lede")} title={tTech("title")} tone="muted">
        <div className="rolegrid">
          {techGroups.map((group) => (
            <div className="rolegrid__item" key={group}>
              <p className="rolegrid__role">{tTech(`groups.${group}.title`)}</p>
              <TagList items={tTech.raw(`groups.${group}.items`) as string[]} />
            </div>
          ))}
        </div>
        <p className="phero__ctas supplement__gap">
          <Link className="btn btn--primary" href={localize(technologyPath("foundation"))}>
            {tTech("ctaPrimary")}
          </Link>
          <Link
            className="btn btn--secondary"
            href={localize(technologyPath("trust-security-operational-resilience"))}
          >
            {tTech("ctaSecondary")}
          </Link>
        </p>
      </Section>

      {/* 09 — Built for different market realities */}
      <Section
        eyebrow={tRegional("eyebrow")}
        lede={tRegional("lede")}
        title={tRegional("title")}
        tone="dark"
      >
        <FeatureList items={regionalItems} />
        <p className="supplement__gap sec__label">{tRegional("supportingLine")}</p>
      </Section>

      {/* 10 — Customer proof */}
      <Section eyebrow={tProof("eyebrow")} title={tProof("title")} tone="muted">
        <ProofBlock body={tProof("lede")} pending pendingNote={tProof("publishingNote")} />
        <div className="supplement__gap">
          <FeatureList items={proofBeats} />
        </div>
        <p className="supplement__gap">
          <Link className="btn btn--secondary" href={localize(STANDALONE_PATHS.customers)}>
            {tProof("ctaSecondary")}
          </Link>
        </p>
      </Section>

      {/* 11 — Insights */}
      <Section eyebrow={tInsights("eyebrow")} title={tInsights("title")}>
        <FeatureList items={insightsItems} />
        <p className="supplement__gap">
          <Link className="related__link" href={localize(resourcePath("insights"))}>
            {tInsights("cta")}
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </Section>

      {/* Automation, intelligence & analytics — the site-wide positioning.
          Distinct from section 07 above: that one describes how intelligent
          operations work, this one states what is automated, what is assisted
          and what stays a human call. */}
      <Section eyebrow={tAia("eyebrow")} lede={tAia("lede")} title={tAia("title")} tone="muted">
        <FeatureList items={tAia.raw("items") as { term: string; description: string }[]} />
        <p className="sec__note">{tAia("note")}</p>
        <p className="supplement__gap">
          <Link
            className="related__link"
            href={localize(capabilityPath("intelligent-operations-decisioning"))}
          >
            {tAia("cta")}
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </Section>

      {/* 12 — Final CTA */}
      <Section eyebrow={tClosing("eyebrow")} lede={tClosing("lede")} title={tClosing("title")} tone="dark">
        <p className="phero__ctas">
          <Link className="btn btn--primary" href={localize(STANDALONE_PATHS.contact)}>
            {tClosing("primary")}
          </Link>
          <Link className="btn btn--secondary" href={localize(STANDALONE_PATHS.requestDemo)}>
            {tClosing("secondary")}
          </Link>
        </p>
      </Section>
    </>
  );
}
