import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { buildPageMetadata } from "@/core/seo/metadata";
import { ContactForm } from "@/features/crm/components/ContactForm";

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return buildPageMetadata({
    path: "/contact",
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <section className="hero">
      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>
      <ContactForm locale={locale} />
    </section>
  );
}
