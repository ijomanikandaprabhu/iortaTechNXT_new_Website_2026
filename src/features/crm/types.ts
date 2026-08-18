import type { Locale } from "@/core/i18n/config";
import type { TenantId } from "@/core/tenancy/config";

/** Provider-neutral contact payload. CRM clients map this to their own fields. */
export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message?: string;
  /** Qualification context; see ContactFormPayload for why all are optional. */
  phone?: string;
  role?: string;
  country?: string;
  product?: string;
  interest?: string;
  source?: string;
  /** Captured for segmentation and reporting in the CRM. */
  locale: Locale;
  tenant: TenantId;
};

export type ContactResult = {
  /** Id assigned by the CRM. */
  id: string;
  provider: CrmProvider;
};

export type CrmProvider = "hubspot" | "salesforce" | "zoho";

/** Contract every CRM client implements. */
export type CrmClient = {
  readonly provider: CrmProvider;
  createContact(input: ContactInput): Promise<ContactResult>;
};
