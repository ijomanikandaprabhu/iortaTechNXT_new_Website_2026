import { tenantIds, type TenantId } from "@/core/tenancy/config";

export type ThemeMode = "light" | "dark";
export type ThemeId = `${TenantId}-${ThemeMode}`;

export type ThemeTokens = Record<string, string>;

/**
 * Every colour and surface token the UI is allowed to use. Components read
 * these as CSS variables (var(--bg)) and never hardcode a colour.
 */
export const themeRegistry: Record<ThemeId, { cssVars: ThemeTokens }> = {
  "default-light": {
    // The default tenant IS the TECHNXT brand, so its semantic variables
    // reference the design tokens rather than restating hex values.
    cssVars: {
      "--bg": "var(--paper)",
      "--fg": "var(--ink)",
      "--muted": "var(--ink-soft)",
      "--surface": "var(--white)",
      "--border": "var(--line)",
      "--primary": "var(--ui-blue)",
      "--primary-fg": "var(--white)",
    },
  },
  "default-dark": {
    cssVars: {
      "--bg": "var(--ink)",
      "--fg": "var(--paper)",
      "--muted": "#9aa3b5",
      "--surface": "#111726",
      "--border": "#1f2739",
      "--primary": "var(--ui-blue-bright)",
      "--primary-fg": "var(--ink)",
    },
  },
  "clientA-light": {
    cssVars: {
      "--bg": "#fdf2f8",
      "--fg": "#4a044e",
      "--muted": "#86608a",
      "--surface": "#fce7f3",
      "--border": "#f5d0e4",
      "--primary": "#db2777",
      "--primary-fg": "#ffffff",
    },
  },
  "clientA-dark": {
    cssVars: {
      "--bg": "#2a0620",
      "--fg": "#fce7f3",
      "--muted": "#d8a7c4",
      "--surface": "#3d0a2e",
      "--border": "#57123f",
      "--primary": "#f472b6",
      "--primary-fg": "#2a0620",
    },
  },
  "clientB-light": {
    cssVars: {
      "--bg": "#f0fdf4",
      "--fg": "#052e16",
      "--muted": "#4d7c60",
      "--surface": "#dcfce7",
      "--border": "#bbf7d0",
      "--primary": "#16a34a",
      "--primary-fg": "#ffffff",
    },
  },
  "clientB-dark": {
    cssVars: {
      "--bg": "#04180e",
      "--fg": "#dcfce7",
      "--muted": "#86b79a",
      "--surface": "#062a17",
      "--border": "#0b3c22",
      "--primary": "#4ade80",
      "--primary-fg": "#04180e",
    },
  },
};

export const defaultMode: ThemeMode = "light";

/** Builds a theme id and falls back to the default tenant's theme if missing. */
export function getThemeId(tenant: TenantId, mode: ThemeMode): ThemeId {
  const id = `${tenant}-${mode}` as ThemeId;
  return id in themeRegistry ? id : (`default-${mode}` as ThemeId);
}

export function getThemeTokens(tenant: TenantId, mode: ThemeMode): ThemeTokens {
  return themeRegistry[getThemeId(tenant, mode)].cssVars;
}

/** Guard: every tenant must have both modes registered. Used by unit tests. */
export function listExpectedThemeIds(): ThemeId[] {
  return tenantIds.flatMap((t) => [`${t}-light`, `${t}-dark`] as ThemeId[]);
}
