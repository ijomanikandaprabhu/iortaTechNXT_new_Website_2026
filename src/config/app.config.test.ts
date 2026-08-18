import { describe, expect, it } from "vitest";
import { normalizeOrigin } from "./app.config";

/**
 * These pin the production outage of 2026-08-18.
 *
 * `NEXT_PUBLIC_SITE_URL` was present but blank on Vercel. `??` treated the
 * empty string as a real value, so `siteUrl` became "", and `new URL("")` in
 * buildPageMetadata threw on every page that defines metadata. The whole
 * marketing site returned 500 while /dashboard, which exports static metadata,
 * kept working.
 */
describe("normalizeOrigin", () => {
  it("treats a blank value as unset", () => {
    expect(normalizeOrigin("")).toBeNull();
    expect(normalizeOrigin("   ")).toBeNull();
    expect(normalizeOrigin(undefined)).toBeNull();
    expect(normalizeOrigin(null)).toBeNull();
  });

  it("returns null for a value the URL parser rejects", () => {
    expect(normalizeOrigin("http://")).toBeNull();
    expect(normalizeOrigin("::::")).toBeNull();
  });

  it("keeps a full origin and strips a trailing slash", () => {
    expect(normalizeOrigin("https://example.com")).toBe("https://example.com");
    expect(normalizeOrigin("https://example.com/")).toBe("https://example.com");
  });

  it("accepts the bare host Vercel exposes and adds https", () => {
    expect(normalizeOrigin("my-app.vercel.app")).toBe("https://my-app.vercel.app");
  });

  it("tolerates surrounding whitespace", () => {
    expect(normalizeOrigin("  https://example.com  ")).toBe("https://example.com");
  });

  it("preserves a configured base path without a trailing slash", () => {
    expect(normalizeOrigin("https://example.com/site/")).toBe("https://example.com/site");
  });

  it("produces something new URL() accepts, which is the whole point", () => {
    const origin = normalizeOrigin("example.com");
    expect(() => new URL(origin!)).not.toThrow();
  });
});
