import type { TenantId } from "@/core/tenancy/config";
import { builtPaths } from "./site.config";

/**
 * Which locale-less paths are public and indexable. Drives the sitemap and the
 * robots rules so the three never drift apart (DRY).
 *
 * Derived from the IA registry rather than hand-listed, and deliberately from
 * its *built* paths only: a sitemap that advertises a route which 404s is worse
 * than one that is briefly incomplete.
 */
export const publicPaths: readonly string[] = builtPaths;

/** Paths that must never be indexed, expressed as robots disallow patterns. */
export const privatePathPatterns = ["/*/dashboard", "/*/settings", "/api/"] as const;

export const seoConfig: Record<TenantId, { siteName: string; twitter?: string }> = {
  default: { siteName: "Iorta Technxt", twitter: "@iortatechnxt" },
  clientA: { siteName: "Client A" },
  clientB: { siteName: "Client B" },
};
