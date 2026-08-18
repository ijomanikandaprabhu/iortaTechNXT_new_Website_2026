import { crmConfig } from "@/config/crm.config";
import type { TenantId } from "@/core/tenancy/config";
import { logger } from "@/lib/logger";
import { createHubspotClient } from "@/services/crm/hubspotClient";
import { createSalesforceClient } from "@/services/crm/salesforceClient";
import { createZohoClient } from "@/services/crm/zohoClient";
import type { ContactInput, ContactResult, CrmClient } from "../types";

/**
 * The only module that knows which CRM a tenant uses. Route handlers call this;
 * nothing else imports a client from services/crm.
 */
function getClient(tenant: TenantId): CrmClient {
  const config = crmConfig[tenant]();

  switch (config.provider) {
    case "hubspot":
      return createHubspotClient(config);
    case "salesforce":
      return createSalesforceClient(config);
    case "zoho":
      return createZohoClient(config);
  }
}

export const crmGateway = {
  async createContact(input: ContactInput): Promise<ContactResult> {
    const client = getClient(input.tenant);

    logger.info("crm.createContact", {
      tenant: input.tenant,
      provider: client.provider,
      locale: input.locale,
    });

    return client.createContact(input);
  },
};
