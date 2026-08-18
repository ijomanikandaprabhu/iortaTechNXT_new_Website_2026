import { isLocale, type Locale } from "@/core/i18n/config";

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message?: string;
  locale: Locale;
  /**
   * Qualification context from the demo, newsletter and contact forms. All
   * optional: the contact form does not collect them, and a form that adds a
   * field must not break the ones that never had it.
   */
  phone?: string;
  role?: string;
  country?: string;
  /** Which product the visitor arrived asking about. */
  product?: string;
  /** Which topic they picked ("core modernization", "claims", …). */
  interest?: string;
  /** Distinguishes a newsletter signup from a sales enquiry in the CRM. */
  source?: string;
};

export type ValidationResult =
  | { ok: true; value: ContactFormPayload }
  | { ok: false; errors: string[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the untrusted request body. Kept dependency-free and shared by the
 * route handler; swap for zod later without changing call sites.
 */
export function validateContactPayload(input: unknown): ValidationResult {
  const errors: string[] = [];
  const data = (input ?? {}) as Record<string, unknown>;

  const str = (key: string) => (typeof data[key] === "string" ? (data[key] as string).trim() : "");

  const firstName = str("firstName");
  const lastName = str("lastName");
  const email = str("email");
  const company = str("company");
  const message = str("message");
  const locale = str("locale");

  // Optional qualification fields. Capped rather than pattern-matched: these
  // are free-text or select values that vary by market, and an over-strict
  // rule here would reject legitimate submissions.
  const optional = { phone: 40, role: 120, country: 120, product: 60, interest: 120, source: 60 };
  const extras: Record<string, string> = {};
  for (const [key, max] of Object.entries(optional)) {
    const value = str(key);
    if (!value) continue;
    if (value.length > max) errors.push(`${key} is too long`);
    else extras[key] = value;
  }

  if (!firstName) errors.push("firstName is required");
  if (!lastName) errors.push("lastName is required");
  if (!EMAIL.test(email)) errors.push("email is invalid");
  if (message.length > 5000) errors.push("message is too long");
  if (!isLocale(locale)) errors.push("locale is invalid");

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      firstName,
      lastName,
      email,
      ...(company ? { company } : {}),
      ...(message ? { message } : {}),
      ...extras,
      locale: locale as Locale,
    },
  };
}
