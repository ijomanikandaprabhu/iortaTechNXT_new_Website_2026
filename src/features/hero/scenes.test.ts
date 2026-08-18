import { describe, expect, it } from "vitest";
import { findOverlaps, lineState, SCENES } from "./scenes";

describe("scene timing", () => {
  it("never shows two scenes at once", () => {
    // Regression: derived windows were wider than the gaps between scenes,
    // leaving scene 2 still fading while scene 3 was wiping in.
    expect(findOverlaps()).toEqual([]);
  });

  it("orders every window forwards", () => {
    for (const s of SCENES) {
      expect(s.enterFrom, s.key).toBeLessThan(s.enterTo);
      expect(s.enterTo, s.key).toBeLessThanOrEqual(s.exitFrom);
      expect(s.exitFrom, s.key).toBeLessThan(s.exitTo);
    }
  });

  it("staggers lines so later lines arrive after earlier ones", () => {
    const scene = SCENES[2]!; // three lines
    const mid = (scene.enterFrom + scene.enterTo) / 2;
    const first = lineState(mid, scene, 0, 3).reveal;
    const last = lineState(mid, scene, 2, 3).reveal;
    expect(first).toBeGreaterThan(last);
  });

  it("is fully hidden outside its own window", () => {
    for (const s of SCENES) {
      const before = lineState(s.enterFrom - 0.001, s, 0, 2);
      expect(before.reveal, `${s.key} before`).toBe(0);

      if (s.exitTo <= 1) {
        const after = lineState(s.exitTo + 0.001, s, 0, 2);
        expect(after.exit, `${s.key} after`).toBe(1);
      }
    }
  });
});
