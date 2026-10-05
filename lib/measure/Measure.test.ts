import { describe, expect, test } from "vitest";
import { candidateFor, distancePx, formatMeasurement } from "./Measure";
import ContourPoints from "@/lib/data/contour/ContourPoints";

const p = (x: number, y: number) => ({ x, y });

const square = (): ContourPoints[] => [
  { points: [p(0, 0), p(10, 0), p(10, 10), p(0, 10)] },
];

describe("candidateFor", () => {
  test("interpolates a point in the middle of a segment by default", () => {
    const candidate = candidateFor(p(5, 1), square(), 12, false);
    expect(candidate).toBeDefined();
    expect(candidate!.point).toStrictEqual(p(5, 0));
    expect(candidate!.isVertex).toBe(false);
  });

  test("clamps to a vertex when the projection falls past a segment end", () => {
    const candidate = candidateFor(p(11, 11), square(), 12, false);
    expect(candidate).toBeDefined();
    expect(candidate!.point).toStrictEqual(p(10, 10));
    expect(candidate!.isVertex).toBe(true);
  });

  test("snaps to the nearest real vertex when snapToVertices is set", () => {
    // Raw point is closest to the middle of the bottom edge, but Ctrl-snap must
    // return an actual vertex instead of an interpolated point.
    const candidate = candidateFor(p(5, 1), square(), 12, true);
    expect(candidate).toBeDefined();
    expect(candidate!.isVertex).toBe(true);
    expect([p(0, 0), p(10, 0)]).toContainEqual(candidate!.point);
  });

  test("returns undefined when nothing is within the max distance", () => {
    expect(candidateFor(p(100, 100), square(), 12, false)).toBeUndefined();
    expect(candidateFor(p(100, 100), square(), 12, true)).toBeUndefined();
  });

  test("returns undefined for an empty contour list", () => {
    expect(candidateFor(p(1, 1), [], 12, false)).toBeUndefined();
    expect(candidateFor(p(1, 1), [], 12, true)).toBeUndefined();
  });

  test("searches across multiple polylines and picks the closest", () => {
    const contours: ContourPoints[] = [
      { points: [p(0, 0), p(10, 0), p(10, 10), p(0, 10)] },
      { points: [p(50, 50), p(60, 50), p(60, 60), p(50, 60)] },
    ];
    const candidate = candidateFor(p(55, 49), contours, 12, false);
    expect(candidate).toBeDefined();
    expect(candidate!.point).toStrictEqual(p(55, 50));
  });
});

describe("distancePx", () => {
  test("returns the euclidean distance", () => {
    expect(distancePx(p(0, 0), p(3, 4))).toBe(5);
  });
});

describe("formatMeasurement", () => {
  test("converts to millimetres with one decimal when a scale is given", () => {
    expect(formatMeasurement(85, 2)).toBe("42.5 mm");
  });

  test("rounds to whole pixels when no scale is available", () => {
    expect(formatMeasurement(128, undefined)).toBe("128 px");
    expect(formatMeasurement(127.6, undefined)).toBe("128 px");
  });

  test("falls back to pixels for a zero scale", () => {
    expect(formatMeasurement(10, 0)).toBe("10 px");
  });
});
