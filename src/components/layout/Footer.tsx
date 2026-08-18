import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import {
  CAPABILITIES,
  COMPANY,
  INDUSTRIES,
  LEGAL,
  PRODUCTS,
  RESOURCES,
  SOLUTIONS,
  STANDALONE_PATHS,
  capabilityPath,
  companyPath,
  industryPath,
  legalPath,
  productPath,
  resourcePath,
  solutionPath,
  type PageEntry,
} from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { tenantConfig } from "@/core/tenancy/config";
import { getTenant } from "@/core/tenancy/getTenant";

type Cell = { key: string; label: string; href?: string };
type Column = { title: string; cells: Cell[] };

/**
 * Site footer, generated from the same IA registry as the header.
 *
 * Entries without `built` render as plain text rather than links, matching the
 * nav. That keeps the footer honest about what exists while still showing the
 * shape of the site, and it keeps the footer out of the sitemap's way: nothing
 * here can advertise a route that 404s.
 *
 * Products link to their overview only. The footer is a map, not a second nav,
 * so the per-product sections stay in the header panel.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const read = nav as unknown as (key: string) => string;
  const path = (p: string) => getLocalizedPath(p, locale);
  const tenant = tenantConfig[getTenant()];

  const cells = (
    entries: PageEntry[],
    area: string,
    toPath: (slug: string) => string,
  ): Cell[] =>
    entries.map((entry) => ({
      key: entry.slug,
      label: read(`entries.${area}.${entry.slug}.label`),
      href: entry.built ? path(toPath(entry.slug)) : undefined,
    }));

  const columns: Column[] = [
    {
      title: t("columns.products"),
      // Products key their label off the product name, not an `entries` row.
      cells: PRODUCTS.map((product) => ({
        key: product.slug,
        label: read(`productNames.${product.slug}`),
        href: product.built ? path(productPath(product.slug)) : undefined,
      })),
    },
    { title: t("columns.solutions"), cells: cells(SOLUTIONS, "solutions", solutionPath) },
    { title: t("columns.industries"), cells: cells(INDUSTRIES, "industries", industryPath) },
    {
      title: t("columns.capabilities"),
      cells: cells(CAPABILITIES, "capabilities", capabilityPath),
    },
    {
      title: t("columns.resources"),
      cells: [
        ...cells(RESOURCES, "resources", resourcePath),
        {
          key: "customers",
          label: read("entries.resources.customers.label"),
          href: path(STANDALONE_PATHS.customers),
        },
      ],
    },
    {
      title: t("columns.company"),
      cells: [
        ...cells(COMPANY, "company", companyPath),
        {
          key: "contact",
          label: read("entries.company.contact.label"),
          href: path(STANDALONE_PATHS.contact),
        },
      ],
    },
  ];

  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__brand">
          <Logo variant="full" size={160} alt={tenant.name} />
          <p className="foot__tagline">{t("tagline")}</p>
          <p className="foot__blurb">{t("blurb")}</p>
        </div>

        <nav className="foot__cols" aria-label={t("nav")}>
          {columns.map((column) => (
            <div key={column.title} className="foot__col">
              <h2 className="foot__coltitle">{column.title}</h2>
              <ul className="foot__list">
                {column.cells.map((cell) => (
                  <li key={cell.key}>
                    {cell.href ? (
                      <Link href={cell.href} className="foot__link">
                        {cell.label}
                      </Link>
                    ) : (
                      <span className="foot__link foot__link--pending">{cell.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="foot__base">
          <p className="foot__copy">
            © {new Date().getFullYear()} {tenant.name}. {t("rights")}
          </p>
          <ul className="foot__legal">
            {LEGAL.map((entry) => (
              <li key={entry.slug}>
                {entry.built ? (
                  <Link href={path(legalPath(entry.slug))} className="foot__link">
                    {read(`entries.legal.${entry.slug}`)}
                  </Link>
                ) : (
                  <span className="foot__link foot__link--pending">
                    {read(`entries.legal.${entry.slug}`)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
