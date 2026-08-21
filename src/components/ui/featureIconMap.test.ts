import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { iconKeyFor } from "./featureIconMap";

const PRODUCTS = [
  "salesverse",
  "brokerverse",
  "agentverse",
  "customerverse",
  "merchantverse",
  "claimverse",
] as const;

/**
 * The rail's icons are chosen from each group's label, so the mapping has to be
 * checked against the labels that actually exist rather than a fixture. New
 * copy is added to these bundles regularly; this is what catches a group that
 * arrives with no sensible icon.
 */
function everyGroupLabel(): string[] {
  const labels = PRODUCTS.flatMap((product) => {
    const bundle = JSON.parse(
      readFileSync(`src/core/i18n/messages/en/products/${product}.json`, "utf8"),
    );
    return (bundle.features.groups as { eyebrow: string }[]).map((g) => g.eyebrow);
  });
  return [...new Set(labels)];
}

describe("feature icon mapping", () => {
  it("resolves every capability group in the bundles", () => {
    const labels = everyGroupLabel();
    expect(labels.length).toBeGreaterThan(60);
    for (const label of labels) {
      expect(iconKeyFor(label), `no icon for "${label}"`).toBeTruthy();
    }
  });

  /**
   * `gear` is the fallback as well as the icon for genuine administration
   * groups, so it cannot be asserted against directly. A sudden jump in how
   * many labels land there is the signal that the rules have stopped covering
   * the copy.
   */
  it("does not let the fallback swallow the rail", () => {
    const labels = everyGroupLabel();
    const gear = labels.filter((l) => iconKeyFor(l) === "gear");
    expect(gear.length / labels.length).toBeLessThan(0.15);
  });

  /**
   * Order-sensitive cases. Each of these labels matches more than one rule, and
   * each was mapped to the wrong icon before the rules were reordered.
   */
  it("picks the subject over the incidental word", () => {
    expect(iconKeyFor("Mobile experience & assisted intelligence")).toBe("device");
    expect(iconKeyFor("Integrations, security & control")).toBe("plug");
    expect(iconKeyFor("New-business operations & underwriting hand-off")).toBe("workflow");
    expect(iconKeyFor("Claims support & client advocacy")).toBe("claims");
    expect(iconKeyFor("Documents, compliance & audit")).toBe("shield");
    expect(iconKeyFor("Finance & accounting operations")).toBe("money");
  });

  it("is stable for a label it has no rule for", () => {
    expect(iconKeyFor("Zzz unmatched capability")).toBe("gear");
  });
});
