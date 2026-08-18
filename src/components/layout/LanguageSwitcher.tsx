"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/core/i18n/config";
import { getLocalizedPath, stripLocale } from "@/core/i18n/routing";

/** Keeps the user on the same page when switching language (good for SEO/UX). */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const basePath = stripLocale(pathname);

  return (
    <nav aria-label="Language" className="lang-switcher">
      {locales.map((l) => (
        <Link
          key={l}
          href={getLocalizedPath(basePath, l)}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
        >
          {localeNames[l]}
        </Link>
      ))}
    </nav>
  );
}
