import type { Locale } from "@/core/i18n/config";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Public marketing shell: header, centered content, sitemap footer. */
export default function MarketingLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <>
      <Header locale={locale} />
      <main className="container">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
