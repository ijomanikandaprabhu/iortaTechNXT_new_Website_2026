/**
 * The header navigation, derived from the IA registry.
 *
 * Header.tsx holds no page list of its own: it passes in a translator and a
 * path localizer, and everything below is generated from `site.config.ts`. Add
 * a page there and it appears here, correctly linked or correctly inert.
 *
 * ## Two decisions worth knowing
 *
 * **Technology sits inside the Capabilities panel** rather than as a tenth
 * top-level trigger. The spec lists nine top-level items, which does not fit a
 * single bar next to the brand lockup and three actions; Technology is the
 * closest neighbour to Capabilities, so it becomes a column there.
 *
 * **Products flattens to one group per product.** The spec nests a fourth
 * level (product then overview/features/use cases) which the three-level
 * `NavItem` shape cannot express. Making each product a group title with its
 * sections as rows says the same thing without a type change.
 */

import {
  CAPABILITY_GROUPS,
  COMPANY,
  INDUSTRIES,
  PRODUCTS,
  PRODUCT_SECTIONS,
  RESOURCES,
  SOLUTIONS,
  STANDALONE_PATHS,
  TECHNOLOGY,
  capabilityPath,
  companyPath,
  industryPath,
  productPath,
  resourcePath,
  solutionPath,
  technologyPath,
  type PageEntry,
} from "@/config/site.config";
import type { NavItem, PanelGroup, PanelItem } from "@/components/layout/NavBar";

/** Reads one `nav.*` message. Supplied by Header so this file stays sync. */
export type NavT = (key: string) => string;
/** Prefixes a path with the active locale. */
export type Localize = (path: string) => string;

/**
 * Builds one panel row. `href` is only set for entries marked `built`, so an
 * unbuilt page shows in the panel as text instead of linking into a 404.
 */
function row(entry: PageEntry, area: string, href: string, t: NavT, localize: Localize): PanelItem {
  return {
    label: t(`entries.${area}.${entry.slug}.label`),
    description: t(`entries.${area}.${entry.slug}.description`),
    href: entry.built ? localize(href) : undefined,
  };
}

function group(
  title: string,
  entries: PageEntry[],
  area: string,
  toPath: (slug: string) => string,
  t: NavT,
  localize: Localize,
): PanelGroup {
  return {
    title,
    items: entries.map((entry) => row(entry, area, toPath(entry.slug), t, localize)),
  };
}

/**
 * The Products panel: one column per product, each listing its three sections.
 * The overview row carries the product's one-line description; the other two
 * share a generic description, since "what the features page is" does not vary
 * per product and repeating six near-identical lines adds noise, not meaning.
 */
function productGroups(t: NavT, localize: Localize): PanelGroup[] {
  return PRODUCTS.map((product) => ({
    title: t(`productNames.${product.slug}`),
    items: [
      ...PRODUCT_SECTIONS.map((section) => ({
        label: t(`productSections.${section}`),
        description:
          section === "overview"
            ? t(`entries.products.${product.slug}`)
            : t(`productSectionDesc.${section}`),
        href: product.built ? localize(productPath(product.slug, section)) : undefined,
      })),
      // The spec ends each product's secondary nav with Request Demo. It is not
      // a `PRODUCT_SECTIONS` entry: there is no per-product demo route, and
      // adding one there would generate `/products/<slug>/request-demo`, which
      // does not exist. It points at the single global demo page instead.
      {
        label: t("productSections.request-demo"),
        description: t("productSectionDesc.request-demo"),
        href: localize(STANDALONE_PATHS.requestDemo),
      },
    ],
  }));
}

export function buildNavItems(t: NavT, localize: Localize): NavItem[] {
  const insurance = INDUSTRIES.slice(0, 7);
  const adjacent = INDUSTRIES.slice(7);

  return [
    {
      label: t("products"),
      href: localize("/"),
      groups: productGroups(t, localize),
      featured: {
        label: t("featured.label"),
        description: t("featured.description"),
        href: localize(productPath("salesverse")),
      },
    },
    {
      label: t("solutions"),
      href: localize("/"),
      groups: [group(t("groups.solutions"), SOLUTIONS, "solutions", solutionPath, t, localize)],
    },
    {
      label: t("industries"),
      href: localize("/"),
      groups: [
        group(t("groups.insurance"), insurance, "industries", industryPath, t, localize),
        group(t("groups.adjacent"), adjacent, "industries", industryPath, t, localize),
      ],
    },
    {
      label: t("capabilities"),
      href: localize("/"),
      groups: [
        ...CAPABILITY_GROUPS.map((capabilityGroup) =>
          group(
            t(`groups.${capabilityGroup.id}`),
            capabilityGroup.items,
            "capabilities",
            capabilityPath,
            t,
            localize,
          ),
        ),
        group(t("groups.technology"), TECHNOLOGY, "technology", technologyPath, t, localize),
      ],
    },
    {
      label: t("resources"),
      href: localize("/"),
      groups: [
        {
          title: t("groups.learn"),
          items: [
            ...RESOURCES.map((entry) => row(entry, "resources", resourcePath(entry.slug), t, localize)),
            // Customer stories is a standalone route, not a /resources child.
            row(
              { slug: "customers", built: true },
              "resources",
              STANDALONE_PATHS.customers,
              t,
              localize,
            ),
          ],
        },
      ],
    },
    {
      label: t("company"),
      href: localize("/"),
      groups: [
        {
          title: t("groups.company"),
          items: [
            ...COMPANY.map((entry) => row(entry, "company", companyPath(entry.slug), t, localize)),
            // Contact is the one company page that already exists.
            row(
              { slug: "contact", built: true },
              "company",
              STANDALONE_PATHS.contact,
              t,
              localize,
            ),
          ],
        },
      ],
    },
  ];
}
