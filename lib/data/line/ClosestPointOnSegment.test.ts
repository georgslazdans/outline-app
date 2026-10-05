import { describe, expect, test } from "vitest";
import { closestPointOnSegment } from "./ClosestPointOnSegment";

const p = (x: number, y: number) => ({ x, y });

describe("closestPointOnSegment", () => {
  test("when point above the middle of a horizontal segment, projects onto it", () => {
    const result = closestPointOnSegment(p(1, 3), p(0, 0), p(2, 0));
    expect(result.point).toStrictEqual(p(1, 0));
    expect(result.isEndpoint).toBe(false);
  });

  test("when point is on the segment, returns the same point", () => {
    const result = closestPointOnSegment(p(1, 0), p(0, 0), p(2, 0));
    expect(result.point).toStrictEqual(p(1, 0));
    expect(result.isEndpoint).toBe(false);
  });

  test("when point is beyond the start, clamps to the start endpoint", () => {
    const result = closestPointOnSegment(p(-5, 1), p(0, 0), p(2, 0));
    expect(result.point).toStrictEqual(p(0, 0));
    expect(result.isEndpoint).toBe(true);
  });

  test("when point is beyond the end, clamps to the end endpoint", () => {
    const result = closestPointOnSegment(p(5, 1), p(0, 0), p(2, 0));
    expect(result.point).toStrictEqual(p(2, 0));
    expect(result.isEndpoint).toBe(true);
  });

  test("when segment is diagonal, projects perpendicularly", () => {
    const result = closestPointOnSegment(p(0, 2), p(0, 0), p(2, 2));
    expect(result.point).toStrictEqual(p(1, 1));
    expect(result.isEndpoint).toBe(false);
  });

  test("when segment is vertical, projects onto it", () => {
    const result = closestPointOnSegment(p(5, 2.5), p(0, 0), p(0, 5));
    expect(result.point).toStrictEqual(p(0, 2.5));
    expect(result.isEndpoint).toBe(false);
  });

  test("when segment is degenerate (a == b), returns that point as endpoint", () => {
    const result = closestPointOnSegment(p(3, 4), p(1, 1), p(1, 1));
    expect(result.point).toStrictEqual(p(1, 1));
    expect(result.isEndpoint).toBe(true);
  });
});
