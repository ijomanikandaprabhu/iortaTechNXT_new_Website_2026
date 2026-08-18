import { describe, expect, it } from "vitest";
import { validateContactPayload } from "./validation";

const valid = {
  firstName: " Asha ",
  lastName: "Kumar",
  email: "asha@example.com",
  locale: "en",
};

describe("validateContactPayload", () => {
  it("accepts and trims a valid payload", () => {
    const result = validateContactPayload(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.firstName).toBe("Asha");
  });

  it("rejects a bad email", () => {
    const result = validateContactPayload({ ...valid, email: "not-an-email" });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.errors).toContain("email is invalid");
  });

  it("rejects an unsupported locale", () => {
    const result = validateContactPayload({ ...valid, locale: "fr" });
    if (!result.ok) expect(result.errors).toContain("locale is invalid");
  });

  it("rejects a non-object body", () => {
    expect(validateContactPayload(null).ok).toBe(false);
  });

  // The demo and newsletter forms send qualification fields the contact form
  // does not. Both directions have to keep working.
  it("keeps the qualification fields the demo form sends", () => {
    const result = validateContactPayload({
      ...valid,
      role: "Head of Distribution",
      country: "Malaysia",
      product: "claimverse",
      source: "request-demo",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.product).toBe("claimverse");
      expect(result.value.source).toBe("request-demo");
    }
  });

  it("still accepts a payload with no qualification fields", () => {
    const result = validateContactPayload(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.product).toBeUndefined();
  });

  it("rejects an over-long qualification field", () => {
    const result = validateContactPayload({ ...valid, country: "x".repeat(200) });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.errors).toContain("country is too long");
  });

  it("drops unknown fields rather than forwarding them to the CRM", () => {
    const result = validateContactPayload({ ...valid, isAdmin: true, tenant: "spoofed" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(Object.keys(result.value)).not.toContain("isAdmin");
  });
});
