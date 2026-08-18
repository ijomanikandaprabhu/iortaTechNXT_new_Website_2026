import { Inter, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
// Renamed to `setRequestLocale` in next-intl v4 — update both call sites together.
import { getMessages, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import "../globals.css";
import { isLocale, locales, localeTags, type Locale } from "@/core/i18n/config";
import { getTenant } from "@/core/tenancy/getTenant";
import { ThemeProvider } from "@/core/theme/ThemeProvider";

/**
 * Fonts are self-hosted at build time by next/font (fetched from Google Fonts
 * during the build, then served from our own origin) — no render-blocking
 * stylesheet and no layout shift. They expose the CSS variables that
 * tokens.css reads for --font-display and --font-body.
 */
/**
 * Loaded as a variable font (no `weight` list) rather than four static cuts.
 * The weight axis has to exist in the file for the breathing headline in the
 * platform section to animate — `font-variation-settings: "wght"` is inert on a
 * static instance. It also ships one file instead of four.
 *
 * Inter stays static: only the display face needs the axis.
 */
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * This is the root layout — there is no app/layout.tsx, so <html> is rendered
 * here where the active locale (and therefore lang/dir) is known.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const tenant = getTenant();

  return (
    <html lang={localeTags[locale as Locale]} className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider tenant={tenant}>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
