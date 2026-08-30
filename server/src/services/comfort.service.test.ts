import { describe, expect, it } from "vitest";

import { calculateComfortIndex } from "./comfort.service.js";

describe("calculateComfortIndex", () => {
  it("returns 100 for ideal weather conditions", () => {
    const score = calculateComfortIndex(
      22, // temperature
      50, // humidity
      2, // wind speed
    );

    expect(score).toBe(100);
  });

  it("returns a lower score for uncomfortable conditions", () => {
    const idealScore = calculateComfortIndex(22, 50, 2);

    const uncomfortableScore = calculateComfortIndex(35, 90, 10);

    expect(uncomfortableScore).toBeLessThan(idealScore);
  });

  it("never returns a score above 100", () => {
    const score = calculateComfortIndex(22, 50, 2);

    expect(score).toBeLessThanOrEqual(100);
  });

  it("never returns a score below 0", () => {
    const score = calculateComfortIndex(100, 100, 100);

    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("returns the final score as a whole number", () => {
    const score = calculateComfortIndex(24.6, 57, 3.4);

    expect(Number.isInteger(score)).toBe(true);
  });
});
