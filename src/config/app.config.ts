/** Environment-derived app constants. Read env vars here, nowhere else. */

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const appConfig = {
  /** Canonical origin, no trailing slash. Used for every absolute URL we emit. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  isProduction: process.env.NODE_ENV === "production",
} as const;

export { requireEnv };
