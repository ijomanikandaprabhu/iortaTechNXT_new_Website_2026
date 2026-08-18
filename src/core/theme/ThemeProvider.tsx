"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { TenantId } from "@/core/tenancy/config";
import { defaultMode, getThemeId, getThemeTokens, type ThemeMode } from "./config";

const STORAGE_KEY = "theme-mode";

type ThemeContextValue = {
  tenant: TenantId;
  mode: ThemeMode;
  themeId: string;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  tenant,
  initialMode = defaultMode,
  children,
}: {
  tenant: TenantId;
  initialMode?: ThemeMode;
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  // Restore the user's preference after hydration; the server render always
  // uses initialMode so markup stays deterministic.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setModeState(stored);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const tokens = useMemo(() => getThemeTokens(tenant, mode), [tenant, mode]);
  const themeId = getThemeId(tenant, mode);

  const value = useMemo<ThemeContextValue>(
    () => ({ tenant, mode, themeId, setMode }),
    [tenant, mode, themeId, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={themeId} style={tokens as React.CSSProperties} className="theme-root">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
