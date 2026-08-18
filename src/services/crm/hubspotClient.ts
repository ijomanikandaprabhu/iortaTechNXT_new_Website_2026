import type { CrmClient, ContactInput, ContactResult } from "@/features/crm/types";
import { httpJson } from "@/services/http/client";

const BASE = "https://api.hubapi.com/crm/v3/objects/contacts";

export function createHubspotClient(config: { apiKey: string }): CrmClient {
  return {
    provider: "hubspot",

    async createContact(input: ContactInput): Promise<ContactResult> {
      const res = await httpJson<{ id: string }>(BASE, {
        method: "POST",
        headers: { authorization: `Bearer ${config.apiKey}` },
        body: {
          properties: {
            firstname: input.firstName,
            lastname: input.lastName,
            email: input.email,
            company: input.company,
            message: input.message,
            hs_language: input.locale,
            tenant: input.tenant,
          },
        },
      });

      return { id: res.id, provider: "hubspot" };
    },
  };
}
