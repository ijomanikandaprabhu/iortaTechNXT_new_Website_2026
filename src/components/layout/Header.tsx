import { getTranslations } from "next-intl/server";
import { buildNavItems } from "@/config/nav.config";
import { productPath } from "@/config/site.config";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { tenantConfig } from "@/core/tenancy/config";
import { getTenant } from "@/core/tenancy/getTenant";
import { NavBar } from "./NavBar";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tenant = getTenant();
  const path = (p: string) => getLocalizedPath(p, locale);

  /**
   * Cast to a plain string-key reader so nav.config.ts can compose dotted keys
   * (`entries.industries.<slug>.label`) from the registry. Every key it builds
   * exists in the bundle; the compiler cannot prove that from a runtime slug,
   * and the alternative is enumerating ~50 literal keys by hand.
   */
  const read = t as unknown as (key: string) => string;

  return (
    <NavBar
      brandName={tenantConfig[tenant].name}
      homeHref={path("/")}
      items={buildNavItems(read, path)}
      labels={{
        signIn: t("signIn"),
        seeDemo: t("seeDemo"),
        getStarted: t("getStarted"),
        menu: t("menu"),
        close: t("close"),
        back: t("back"),
        announcement: t("announcement"),
        announcementCta: t("announcementCta"),
        dismiss: t("dismiss"),
        featuredTitle: t("groups.featured"),
      }}
      hrefs={{
        signIn: path("/dashboard"),
        demo: path("/contact"),
        cta: path("/contact"),
        // The banner points at the thing it announces, not at the contact form.
        announcement: path(productPath("salesverse")),
      }}
    />
  );
}
