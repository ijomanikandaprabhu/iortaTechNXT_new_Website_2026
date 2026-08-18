/**
 * Tenant registry. Adding a tenant is a change to this file plus a theme entry
 * in core/theme/config.ts and a CRM entry in config/crm.config.ts.
 */
export const tenantIds = ["default", "clientA", "clientB"] as const;

export type TenantId = (typeof tenantIds)[number];

export const defaultTenant: TenantId = "default";

/** Hostname (without port) -> tenant. Subdomains are matched exactly. */
export const tenantByDomain: Record<string, TenantId> = {
  "localhost": "default",
  "iortatechnxt.com": "default",
  "www.iortatechnxt.com": "default",
  "client-a.localhost": "clientA",
  "client-a.com": "clientA",
  "client-b.localhost": "clientB",
  "client-b.com": "clientB",
};

/** Per-tenant presentation data that is not theme colours. */
export const tenantConfig: Record<TenantId, { name: string; supportEmail: string }> = {
  default: { name: "Iorta Technxt", supportEmail: "hello@iortatechnxt.com" },
  clientA: { name: "Client A", supportEmail: "support@client-a.com" },
  clientB: { name: "Client B", supportEmail: "support@client-b.com" },
};

export function isTenantId(value: string): value is TenantId {
  return (tenantIds as readonly string[]).includes(value);
}
