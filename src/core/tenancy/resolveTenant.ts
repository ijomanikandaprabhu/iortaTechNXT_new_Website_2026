import { defaultTenant, tenantByDomain, type TenantId } from "./config";

/**
 * Maps a Host header value to a tenant. Pure and synchronous so it can be used
 * in middleware (edge), route handlers, and tests alike.
 */
export function resolveTenant(hostname: string | null | undefined): TenantId {
  if (!hostname) return defaultTenant;

  // Strip port and normalize case: "Client-A.com:3000" -> "client-a.com".
  const host = hostname.split(":")[0]!.trim().toLowerCase();
  return tenantByDomain[host] ?? defaultTenant;
}

/** Header used to carry the resolved tenant from middleware to server components. */
export const TENANT_HEADER = "x-tenant-id";
