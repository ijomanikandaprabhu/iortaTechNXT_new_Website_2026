import type { Metadata } from "next";
import type { Locale } from "@/core/i18n/config";
import { Header } from "@/components/layout/Header";

/** Private app shell. Nothing under this group should ever be indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({
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
    </>
  );
}
