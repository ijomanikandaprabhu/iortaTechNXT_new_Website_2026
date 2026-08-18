/**
 * The site's information architecture, as data.
 *
 * This is the single source of truth for the navigation, the footer, the
 * sitemap and every dynamic route's `generateStaticParams`. Adding a page means
 * adding an entry here; nothing else has to be kept in step by hand.
 *
 * ## The `built` flag
 *
 * The full IA is listed even though most of it is not implemented yet, because
 * the navigation needs to show the shape of the site before every page exists.
 * `built: true` marks the pages that actually resolve. Entries without it are
 * rendered as plain text in the nav rather than as links, and are kept out of
 * the sitemap — the same rule the bento cards already follow on the home page,
 * where cells are deliberately not links until their targets exist.
 *
 * Remove nothing when building a page: just add `built: true`.
 */

export type PageEntry = {
  /** URL segment, and the key used to look labels up in `nav.entries`. */
  slug: string;
  /** True once the page resolves. Gates linking and sitemap inclusion. */
  built?: true;
};

/**
 * Products carry three pages each (overview, features, use cases).
 *
 * ## MerchantVerse is deliberately narrower
 *
 * Its pages describe partner application, information, documents, review,
 * approval, activation and partner-record management only. The following are
 * **withheld pending product-owner validation** and must not be added to
 * `products/merchantverse.json` until the product team confirms them:
 *
 * product/channel assignment, partner hierarchy, embedded journey
 * configuration, transaction analytics, commission calculation, settlement,
 * reconciliation, full KYB orchestration, partner sales dashboards.
 *
 * Accuracy has priority over matching the other products' feature counts.
 */
export const PRODUCTS: PageEntry[] = [
  { slug: "salesverse", built: true },
  { slug: "brokerverse", built: true },
  { slug: "agentverse", built: true },
  { slug: "customerverse", built: true },
  { slug: "merchantverse", built: true },
  { slug: "claimverse", built: true },
];

/** The sub-pages every product has, in nav order. */
export const PRODUCT_SECTIONS = ["overview", "features", "use-cases"] as const;
export type ProductSection = (typeof PRODUCT_SECTIONS)[number];

export const SOLUTIONS: PageEntry[] = [
  { slug: "distribution-modernization", built: true },
  { slug: "underwriting-modernization", built: true },
  { slug: "core-modernization", built: true },
  { slug: "digital-insurance-takaful", built: true },
];

export const INDUSTRIES: PageEntry[] = [
  { slug: "insurance-carriers", built: true },
  { slug: "life-health-insurance", built: true },
  { slug: "general-insurance", built: true },
  { slug: "commercial-specialty-insurance", built: true },
  { slug: "bancassurance", built: true },
  { slug: "takaful", built: true },
  { slug: "insurance-brokers-agencies", built: true },
  { slug: "fintech-digital-platforms", built: true },
  { slug: "travel-commerce", built: true },
  { slug: "health-benefits-healthcare", built: true },
];

/**
 * Capabilities are presented in five named groups rather than one flat list of
 * eleven, matching how the nav is specified.
 */
export const CAPABILITY_GROUPS: { id: string; items: PageEntry[] }[] = [
  {
    id: "build",
    items: [
      { slug: "experience-design", built: true },
      { slug: "api-microservices", built: true },
      { slug: "oracle-coe", built: true },
      { slug: "application-development-support", built: true },
    ],
  },
  {
    id: "data",
    items: [
      { slug: "intelligent-operations-decisioning", built: true },
      { slug: "data-analytics", built: true },
    ],
  },
  {
    id: "engineer",
    items: [
      { slug: "agile-cloud-devops", built: true },
      { slug: "cybersecurity", built: true },
      { slug: "quality-engineering", built: true },
    ],
  },
  { id: "advisory", items: [{ slug: "digital-consulting", built: true }] },
  { id: "additional", items: [{ slug: "talent-services", built: true }] },
];

/** Flattened, for route generation and the footer. */
export const CAPABILITIES: PageEntry[] = CAPABILITY_GROUPS.flatMap((group) => group.items);

export const TECHNOLOGY: PageEntry[] = [
  { slug: "foundation", built: true },
  { slug: "integrations", built: true },
  { slug: "trust-security-operational-resilience", built: true },
  { slug: "implementation-customer-success", built: true },
];

export const RESOURCES: PageEntry[] = [
  { slug: "insights", built: true },
  { slug: "news-events", built: true },
  { slug: "newsletter", built: true },
];

export const COMPANY: PageEntry[] = [
  { slug: "about", built: true },
  { slug: "leadership", built: true },
  { slug: "careers", built: true },
];

export const LEGAL: PageEntry[] = [
  { slug: "privacy", built: true },
  { slug: "cookies", built: true },
  { slug: "terms", built: true },
  { slug: "accessibility", built: true },
  { slug: "responsible-disclosure", built: true },
];

/* ------------------------------------------------------------------ paths */

export const productPath = (slug: string, section: ProductSection = "overview") =>
  section === "overview" ? `/products/${slug}` : `/products/${slug}/${section}`;

export const solutionPath = (slug: string) => `/solutions/${slug}`;
export const industryPath = (slug: string) => `/industries/${slug}`;
export const capabilityPath = (slug: string) => `/capabilities/${slug}`;
export const technologyPath = (slug: string) => `/technology/${slug}`;
export const companyPath = (slug: string) => `/company/${slug}`;
export const legalPath = (slug: string) => `/legal/${slug}`;
export const resourcePath = (slug: string) => `/resources/${slug}`;

/** Standalone routes that do not belong to a slug family. */
export const STANDALONE_PATHS = {
  home: "/",
  contact: "/contact",
  requestDemo: "/request-demo",
  customers: "/customers",
} as const;

const built = (entries: PageEntry[]) => entries.filter((entry) => entry.built);

/**
 * Every path that currently resolves. Drives the sitemap and robots rules, so
 * it must never advertise a route that 404s.
 */
export const builtPaths: string[] = [
  STANDALONE_PATHS.home,
  STANDALONE_PATHS.contact,
  ...built(PRODUCTS).flatMap((product) =>
    PRODUCT_SECTIONS.map((section) => productPath(product.slug, section)),
  ),
  ...built(SOLUTIONS).map((entry) => solutionPath(entry.slug)),
  ...built(INDUSTRIES).map((entry) => industryPath(entry.slug)),
  ...built(CAPABILITIES).map((entry) => capabilityPath(entry.slug)),
  ...built(TECHNOLOGY).map((entry) => technologyPath(entry.slug)),
  ...built(COMPANY).map((entry) => companyPath(entry.slug)),
  ...built(LEGAL).map((entry) => legalPath(entry.slug)),
  ...built(RESOURCES).map((entry) => resourcePath(entry.slug)),
  STANDALONE_PATHS.customers,
  STANDALONE_PATHS.requestDemo,
];

/** Slugs for `generateStaticParams`, so no route pre-renders a missing page. */
export const builtSlugs = {
  products: built(PRODUCTS).map((entry) => entry.slug),
  solutions: built(SOLUTIONS).map((entry) => entry.slug),
  industries: built(INDUSTRIES).map((entry) => entry.slug),
  capabilities: built(CAPABILITIES).map((entry) => entry.slug),
  technology: built(TECHNOLOGY).map((entry) => entry.slug),
  company: built(COMPANY).map((entry) => entry.slug),
  legal: built(LEGAL).map((entry) => entry.slug),
};
