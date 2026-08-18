import type { CrmClient, ContactInput, ContactResult } from "@/features/crm/types";
import { httpJson } from "@/services/http/client";

export function createSalesforceClient(config: { token: string; instanceUrl: string }): CrmClient {
  return {
    provider: "salesforce",

    async createContact(input: ContactInput): Promise<ContactResult> {
      const url = `${config.instanceUrl.replace(/\/$/, "")}/services/data/v60.0/sobjects/Contact`;

      const res = await httpJson<{ id: string }>(url, {
        method: "POST",
        headers: { authorization: `Bearer ${config.token}` },
        body: {
          FirstName: input.firstName,
          LastName: input.lastName,
          Email: input.email,
          Company__c: input.company,
          Description: input.message,
          Preferred_Language__c: input.locale,
          Tenant__c: input.tenant,
        },
      });

      return { id: res.id, provider: "salesforce" };
    },
  };
}
