import { describe, expect, it } from "vitest";
import { resolveTenant } from "./resolveTenant";

describe("resolveTenant", () => {
  it("maps a known host to its tenant", () => {
    expect(resolveTenant("client-a.com")).toBe("clientA");
  });

  it("ignores port and casing", () => {
    expect(resolveTenant("Client-B.com:3000")).toBe("clientB");
  });

  it("falls back to the default tenant for unknown or missing hosts", () => {
    expect(resolveTenant("unknown.example")).toBe("default");
    expect(resolveTenant(null)).toBe("default");
  });
});
