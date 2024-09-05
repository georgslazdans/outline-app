import { describe, expect, test } from "vitest";
import { forPoints } from "./Point";

const p = (x: number, y: number) => {
  return {
    x: x,
    y: y,
  };
};

describe("getMagnitudeDistanceTo", () => {
  test("when point on middle of line, returns 0 ", () => {
    const a = p(0, 0);
    const b = p(2, 0);
    const point = p(1, 0);

    const result = forPoints(a, b).getMagnitudeDistanceTo(point);
    expect(result).toBe(0);
  });

  test("when point on start of point, returns second point ", () => {
    const a = p(0, 0);
    const b = p(2, 0);
    const point = p(0, 0);

    const result = forPoints(a, b).getMagnitudeDistanceTo(point);
    expect(result).toBe(2);
  });

  test("when comparing to a negative point ", () => {
    const a = p(0, 0);
    const b = p(-10, 0);
    const point = p(5, 0);

    const result = forPoints(a, b).getMagnitudeDistanceTo(point);
    expect(result).toBe(20);
  });

  test("test negative values ", () => {
    const a = p(-2, -20);
    const b = p(0, 0);
    const point = p(0, 2);

    const result = forPoints(a, b).getMagnitudeDistanceTo(point);
    expect(result).toBe(24.08318915758459);
  });
});
