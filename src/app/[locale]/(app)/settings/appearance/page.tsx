import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { ThemeModeToggle } from "@/components/layout/ThemeModeToggle";

export default async function AppearancePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "appearance" });

  return (
    <section className="hero">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <ThemeModeToggle />
    </section>
  );
}
