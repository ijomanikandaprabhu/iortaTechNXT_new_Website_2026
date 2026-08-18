import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { tenantConfig } from "@/core/tenancy/config";
import { getTenant } from "@/core/tenancy/getTenant";

export default async function DashboardPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tenant = getTenant();

  return (
    <section className="hero">
      <h1>{t("title")}</h1>
      <p>{t("welcome")}</p>
      <p style={{ color: "var(--muted)" }}>{tenantConfig[tenant].name}</p>
    </section>
  );
}
