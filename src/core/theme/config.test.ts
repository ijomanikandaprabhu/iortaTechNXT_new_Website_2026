import { describe, expect, it } from "vitest";
import { getThemeId, listExpectedThemeIds, themeRegistry } from "./config";

describe("theme registry", () => {
  it("registers light and dark for every tenant", () => {
    for (const id of listExpectedThemeIds()) {
      expect(themeRegistry[id], `missing theme ${id}`).toBeDefined();
    }
  });

  it("exposes the same token names across every theme", () => {
    const entries = Object.values(themeRegistry).map((t) => Object.keys(t.cssVars).sort().join(","));
    expect(new Set(entries).size).toBe(1);
  });

  it("falls back to the default tenant theme", () => {
    // @ts-expect-error deliberately passing an unregistered tenant
    expect(getThemeId("nope", "dark")).toBe("default-dark");
  });
});
