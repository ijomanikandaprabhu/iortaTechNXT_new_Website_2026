import type { TenantId } from "@/core/tenancy/config";
import type { CrmProvider } from "@/features/crm/types";

export type CrmTenantConfig =
  | { provider: "hubspot"; apiKey: string }
  | { provider: "salesforce"; token: string; instanceUrl: string }
  | { provider: "zoho"; token: string; apiDomain: string };

/**
 * Which CRM each tenant writes to. Values are read lazily (function form) so a
 * missing credential for an unused tenant does not break the build.
 */
export const crmConfig: Record<TenantId, () => CrmTenantConfig> = {
  default: () => ({
    provider: "hubspot",
    apiKey: process.env.HUBSPOT_KEY_DEFAULT ?? "",
  }),
  clientA: () => ({
    provider: "salesforce",
    token: process.env.SALESFORCE_TOKEN_CLIENT_A ?? "",
    instanceUrl: process.env.SALESFORCE_INSTANCE_CLIENT_A ?? "",
  }),
  clientB: () => ({
    provider: "zoho",
    token: process.env.ZOHO_TOKEN_CLIENT_B ?? "",
    apiDomain: process.env.ZOHO_API_DOMAIN_CLIENT_B ?? "https://www.zohoapis.com",
  }),
};

export function getCrmProviderFor(tenant: TenantId): CrmProvider {
  return crmConfig[tenant]().provider;
}
