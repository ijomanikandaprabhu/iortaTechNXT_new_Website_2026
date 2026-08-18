import type { CrmClient, ContactInput, ContactResult } from "@/features/crm/types";
import { httpJson } from "@/services/http/client";

type ZohoResponse = { data: Array<{ details: { id: string } }> };

export function createZohoClient(config: { token: string; apiDomain: string }): CrmClient {
  return {
    provider: "zoho",

    async createContact(input: ContactInput): Promise<ContactResult> {
      const url = `${config.apiDomain.replace(/\/$/, "")}/crm/v5/Contacts`;

      const res = await httpJson<ZohoResponse>(url, {
        method: "POST",
        headers: { authorization: `Zoho-oauthtoken ${config.token}` },
        body: {
          data: [
            {
              First_Name: input.firstName,
              Last_Name: input.lastName,
              Email: input.email,
              Account_Name: input.company,
              Description: input.message,
              Language: input.locale,
              Tenant: input.tenant,
            },
          ],
        },
      });

      const id = res.data?.[0]?.details?.id;
      if (!id) throw new Error("Zoho did not return a contact id");

      return { id, provider: "zoho" };
    },
  };
}
