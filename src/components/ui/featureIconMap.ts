/**
 * Icon selection for the product Features rail.
 *
 * The six products carry 69 distinct capability groups between them, and the
 * set grows whenever copy is added. Hand-assigning an icon per group would mean
 * a lookup table that silently falls out of step with the message bundles, so
 * the icon is derived from the group's own label instead.
 *
 * Kept apart from the component that draws the glyphs so the mapping can be
 * tested against every label in the message bundles without a JSX runtime.
 */

export type IconKey =
  | "claims"
  | "money"
  | "shield"
  | "plug"
  | "chart"
  | "workflow"
  | "renew"
  | "learn"
  | "bell"
  | "calendar"
  | "device"
  | "doc"
  | "target"
  | "people"
  | "gear";

/**
 * Ordered, first match wins. Order is the whole design here: many labels carry
 * several of these words ("Claims support & client advocacy" is both claims and
 * client; "Documents, compliance & audit" is both document and audit), so the
 * more specific subject is tested before the more general one.
 */
const RULES: Array<[IconKey, RegExp]> = [
  ["claims", /claim|fnol|assessment|investigation|provider|triage|settlement/i],
  ["money", /premium|commission|payment|billing|collection|finance|accounting|incentive|target/i],
  // Above `shield`: "Integrations, security & control" leads with the integration.
  ["plug", /integration|connectivity|api|omnichannel/i],
  ["shield", /security|compliance|audit|fraud|anomaly|authority|approval|identity|secure|control|verification|decision/i],
  // Above `chart`: "Mobile experience & assisted intelligence" is about the
  // device, not about analytics.
  ["device", /mobile|localization|accessibility|responsive|experience|portal|home/i],
  ["chart", /analytic|reporting|monitoring|performance|intelligence|insight/i],
  ["workflow", /workflow|queue|task|straight-through|process|review|operation|exception|activation|underwriting|hand-off/i],
  ["renew", /renewal|lifecycle|servicing|onboarding|readiness|continuation|growth/i],
  ["learn", /learning|coaching|development|enablement|guided|discovery|recruitment|candidate/i],
  ["bell", /notification|proactive|communication|support|advocacy/i],
  ["calendar", /planner|daily|activity|meeting|schedul/i],
  ["doc", /document|evidence|application|proposal|quotation|quote|information|intake|requirement|policy/i],
  ["target", /lead|opportunity|sales|pipeline|prospect|placement|distribution|partner/i],
  ["people", /client|customer|account|relationship|contact|book|manager|people|roles/i],
  ["gear", /administration|configuration|setting|access|structure|management/i],
];


/** Exported for the test that walks every group label in the bundles. */
export function iconKeyFor(label: string): IconKey {
  for (const [key, pattern] of RULES) {
    if (pattern.test(label)) return key;
  }
  // Reached only by a label none of the rules describe; the generic mark is a
  // better outcome than a blank slot in the rail.
  return "gear";
}

