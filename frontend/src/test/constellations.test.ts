import { describe, it, expect } from "vitest";
import {
  CONSTELLATIONS,
  getConstellationForProject,
  Constellation,
} from "@/lib/constellations";

describe("Constellation Catalog", () => {
  it("contains at least 16 authentic constellations", () => {
    expect(CONSTELLATIONS.length).toBeGreaterThanOrEqual(16);
  });

  it("ensures all constellations have unique IDs and valid attributes", () => {
    const ids = new Set<string>();
    const names = new Set<string>();

    CONSTELLATIONS.forEach((c: Constellation) => {
      expect(c.id).toBeTruthy();
      expect(ids.has(c.id)).toBe(false);
      ids.add(c.id);

      expect(c.name).toBeTruthy();
      expect(names.has(c.name)).toBe(false);
      names.add(c.name);

      expect(c.latinName).toBeTruthy();
      expect(c.alphaStar).toBeTruthy();
      expect(c.spectralColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(c.nebulaColor).toBeTruthy();
      expect(c.coordinates).toBeTruthy();

      // Check stars
      expect(c.stars.length).toBeGreaterThanOrEqual(4);
      c.stars.forEach((star) => {
        expect(star.id).toBeTruthy();
        expect(star.x).toBeGreaterThanOrEqual(0);
        expect(star.x).toBeLessThanOrEqual(100);
        expect(star.y).toBeGreaterThanOrEqual(0);
        expect(star.y).toBeLessThanOrEqual(100);
        expect(star.size).toBeGreaterThan(0);
        expect(["supergiant", "alpha", "major", "minor"]).toContain(star.magnitude);
      });

      // Check lines
      expect(c.lines.length).toBeGreaterThan(0);
      c.lines.forEach(([fromIdx, toIdx]) => {
        expect(fromIdx).toBeGreaterThanOrEqual(0);
        expect(fromIdx).toBeLessThan(c.stars.length);
        expect(toIdx).toBeGreaterThanOrEqual(0);
        expect(toIdx).toBeLessThan(c.stars.length);
      });
    });
  });

  it("includes classic signature constellations like Orion, Cygnus, Ursa Major, Cassiopeia", () => {
    const ids = CONSTELLATIONS.map((c) => c.id);
    expect(ids).toContain("orion");
    expect(ids).toContain("cygnus");
    expect(ids).toContain("ursa-major");
    expect(ids).toContain("cassiopeia");
    expect(ids).toContain("scorpius");
    expect(ids).toContain("sagittarius");
  });
});

describe("getConstellationForProject", () => {
  it("deterministically returns constellations by project ID", () => {
    const c1 = getConstellationForProject(1, "Alpha");
    const c2 = getConstellationForProject(2, "Beta");
    const c1Again = getConstellationForProject(1, "Alpha");

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    expect(c1.id).toEqual(c1Again.id);
    expect(c1.id).not.toEqual(c2.id);
  });

  it("wraps around the constellation catalog for higher IDs", () => {
    const c1 = getConstellationForProject(1);
    const cCycle = getConstellationForProject(1 + CONSTELLATIONS.length);
    expect(c1.id).toBe(cCycle.id);
  });

  it("uses index when provided", () => {
    const c0 = getConstellationForProject(null, null, 0);
    const c1 = getConstellationForProject(null, null, 1);
    expect(c0.id).toBe(CONSTELLATIONS[0].id);
    expect(c1.id).toBe(CONSTELLATIONS[1].id);
  });

  it("handles null, undefined, and empty string safely without crashing", () => {
    const cNull = getConstellationForProject(null, null);
    const cUndef = getConstellationForProject(undefined, undefined);
    const cEmpty = getConstellationForProject("", "");

    expect(cNull).toBeDefined();
    expect(cNull.stars.length).toBeGreaterThan(0);
    expect(cUndef).toBeDefined();
    expect(cEmpty).toBeDefined();
  });
});
