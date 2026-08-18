/** Environment-derived app constants. Read env vars here, nowhere else. */

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Turns a configured origin into a usable base URL, or null if it cannot be one.
 *
 * Accepts a bare host ("example.com") as well as a full origin, tolerates
 * surrounding whitespace and a trailing slash, and rejects anything the URL
 * parser will not accept.
 */
export function normalizeOrigin(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);
    // Keep a base path if one was configured, but never a trailing slash.
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

/**
 * Canonical origin for every absolute URL the site emits.
 *
 * Resolution order: an explicit NEXT_PUBLIC_SITE_URL, then the deployment URL
 * Vercel exposes automatically, then localhost for local work.
 *
 * `??` is deliberately not used here. An environment variable that exists but
 * is blank is easy to create in a hosting dashboard, and `??` treats "" as a
 * real value. That left `siteUrl` empty, and `new URL("")` inside
 * buildPageMetadata threw on every page that defines metadata — taking down
 * the entire marketing site in production while /dashboard, which exports a
 * static metadata object and never builds a URL, kept working.
 *
 * A malformed value now falls through to the next candidate instead of
 * throwing at render time.
 */
const siteUrl =
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeOrigin(process.env.NEXT_PUBLIC_VERCEL_URL) ??
  "http://localhost:3000";

export const appConfig = {
  /** Canonical origin, no trailing slash. Used for every absolute URL we emit. */
  siteUrl,
  isProduction: process.env.NODE_ENV === "production",
} as const;

export { requireEnv };
