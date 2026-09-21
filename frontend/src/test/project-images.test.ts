import { describe, it, expect } from "vitest";
import { getProjectGradient, PROJECT_GRADIENTS, getAvatarColor } from "@/lib/project-images";

describe("getProjectGradient", () => {
  it("returns a valid gradient theme with background and accent", () => {
    const gradient = getProjectGradient(1, "My First App");
    expect(gradient).toBeDefined();
    expect(gradient.background).toContain("linear-gradient");
    expect(gradient.background).toContain("gradient");
    expect(gradient.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("returns distinct gradients for different projects", () => {
    const g1 = getProjectGradient(1, "Project One");
    const g2 = getProjectGradient(2, "Project Two");
    const g1 = getProjectGradient(1, "Project One", 0);
    const g2 = getProjectGradient(2, "Project Two", 1);
    expect(PROJECT_GRADIENTS.length).toBeGreaterThanOrEqual(16);
    expect(g1).toBeDefined();
    expect(g2).toBeDefined();
    expect(g1.name).not.toBe(g2.name);
    expect(g1.background).not.toBe(g2.background);
  });

  it("handles null and undefined safely", () => {
    const gradient = getProjectGradient(null, null);
    expect(gradient).toBeDefined();
    expect(gradient.background).toContain("linear-gradient");
    expect(gradient.background).toContain("gradient");
  });
});

