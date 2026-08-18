import { describe, expect, it } from "vitest";
import { logoMinSize } from "@/config/brand.config";
import { getLockupClearspace, resolveLogoSize } from "./logoSize";

describe("resolveLogoSize", () => {
  it("defaults to the variant minimum when no size is given", () => {
    expect(resolveLogoSize("full").size).toBe(160);
    expect(resolveLogoSize("icon").size).toBe(32);
    expect(resolveLogoSize("shield-filled").size).toBe(48);
    expect(resolveLogoSize("shield-outline").size).toBe(48);
  });

  it("clamps below-minimum sizes and reports why", () => {
    const result = resolveLogoSize("icon", 16);
    expect(result.size).toBe(32);
    expect(result.clamped).toBe(true);
    expect(result.warning).toMatch(/minimum is 32px/);
  });

  it("clamps the shield to 48px, not the bare icon minimum", () => {
    // The shield carries more internal detail, so it has a higher floor.
    expect(resolveLogoSize("shield-outline", 40).size).toBe(48);
  });

  it("passes through sizes at or above the minimum", () => {
    expect(resolveLogoSize("full", 240)).toEqual({ size: 240, clamped: false });
    expect(resolveLogoSize("full", 160).clamped).toBe(false);
  });

  it("falls back to the minimum for invalid input", () => {
    for (const bad of [0, -10, Number.NaN]) {
      const result = resolveLogoSize("icon", bad);
      expect(result.size).toBe(32);
      expect(result.clamped).toBe(true);
    }
  });

  it("covers every registered variant", () => {
    for (const variant of Object.keys(logoMinSize) as Array<keyof typeof logoMinSize>) {
      expect(resolveLogoSize(variant).size).toBe(logoMinSize[variant]);
    }
  });
});

describe("getLockupClearspace", () => {
  it("equals the icon height, i.e. lockup width / aspect ratio", () => {
    expect(getLockupClearspace(450, 4.5)).toBe(100);
  });
});
