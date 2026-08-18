"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/core/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";

export function ThemeModeToggle() {
  const t = useTranslations("appearance");
  const { mode, setMode } = useTheme();

  return (
    <Button variant="secondary" onClick={() => setMode(mode === "light" ? "dark" : "light")}>
      {mode === "light" ? t("dark") : t("light")}
    </Button>
  );
}
