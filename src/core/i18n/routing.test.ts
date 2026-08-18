import { describe, expect, it } from "vitest";
import { getAllLocalizedPaths, getLocaleFromPath, getLocalizedPath, stripLocale } from "./routing";

/**
 * Single active locale while the copy is English-only. The helpers are still
 * locale-generic — add cases here when th/vi are switched back on.
 */
describe("routing helpers", () => {
  it("prefixes paths with the locale", () => {
    expect(getLocalizedPath("/contact", "en")).toBe("/en/contact");
    expect(getLocalizedPath("/", "en")).toBe("/en");
    expect(getLocalizedPath("contact", "en")).toBe("/en/contact");
  });

  it("strips a leading locale segment", () => {
    expect(stripLocale("/en/contact")).toBe("/contact");
    expect(stripLocale("/en")).toBe("/");
    expect(stripLocale("/contact")).toBe("/contact");
  });

  it("leaves an inactive locale segment alone", () => {
    // "th" is parked, so it is not treated as a locale prefix.
    expect(stripLocale("/th/contact")).toBe("/th/contact");
  });

  it("reads the locale from a path with a fallback", () => {
    expect(getLocaleFromPath("/en/contact")).toBe("en");
    expect(getLocaleFromPath("/contact")).toBe("en");
  });

  it("builds every locale variant", () => {
    expect(getAllLocalizedPaths("/contact")).toEqual({ en: "/en/contact" });
  });
});
