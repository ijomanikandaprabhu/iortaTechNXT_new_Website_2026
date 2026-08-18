import { headers } from "next/headers";
import { defaultTenant, isTenantId, type TenantId } from "./config";
import { resolveTenant, TENANT_HEADER } from "./resolveTenant";

/**
 * Server-side tenant accessor. Reads the header set by middleware and falls
 * back to resolving the Host directly (e.g. for route handlers hit without
 * passing through middleware in tests).
 */
export function getTenant(): TenantId {
  const h = headers();
  const fromHeader = h.get(TENANT_HEADER);
  if (fromHeader && isTenantId(fromHeader)) return fromHeader;

  const host = h.get("host");
  return host ? resolveTenant(host) : defaultTenant;
}
