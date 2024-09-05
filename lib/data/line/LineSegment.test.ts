import { describe, expect, test } from "vitest";
import LineSegment, {
  movePointToLineSegment,
  normalDistanceToSegment,
} from "./LineSegment";

const p = (x: number, y: number) => {
  return {
    x: x,
    y: y,
  };
};

describe("distanceToSegment", () => {
  test("when point on segment, returns 0", () => {
    const point = p(1, 0);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 0),
      indexA: 0,
      indexB: 1,
    };

    const result = normalDistanceToSegment(segment).of(point);
    expect(result).toBe(0);
  });

  test("when point on segment vertical, returns 0", () => {
    const point = p(0, 1);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(0, 2),
      indexA: 0,
      indexB: 1,
    };

    const result = normalDistanceToSegment(segment).of(point);
    expect(result).toBe(0);
  });

  test("when point on above segment 1, returns 2", () => {
    const point = p(0, 2);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 0),
      indexA: 0,
      indexB: 1,
    };

    const result = normalDistanceToSegment(segment).of(point);
    expect(result).toBe(2);
  });

  test("when point intersects at 45 degrees, returns 0", () => {
    const point = p(1, 1);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 2),
      indexA: 0,
      indexB: 1,
    };

    const result = normalDistanceToSegment(segment).of(point);
    expect(result).toBe(0);
  });

  test("when point above 1 from 45 degree line, returns 1", () => {
    const point = p(0, Math.sqrt(2));
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 2),
      indexA: 0,
      indexB: 1,
    };

    const result = normalDistanceToSegment(segment).of(point);
    expect(result).toBe(1);
  });
});

describe("movePointToLineSegment", () => {
  test("when point on segment, returns the same point", () => {
    const point = p(1, 0);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 0),
      indexA: 0,
      indexB: 1,
    };

    const result = movePointToLineSegment(point, segment);
    
    expect(result).toStrictEqual(p(1,0));
  });

  test("when point above segment, returns point on segment", () => {
    const point = p(1, 1);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 0),
      indexA: 0,
      indexB: 1,
    };

    const result = movePointToLineSegment(point, segment);
    
    expect(result).toStrictEqual(p(1,0));
  });

  test("when point above segment at 45 degrees, returns point on segment", () => {
    const point = p(0, 2);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(2, 2),
      indexA: 0,
      indexB: 1,
    };

    const result = movePointToLineSegment(point, segment);
    
    expect(result).toStrictEqual(p(1,1));
  });

  test("when segment is vertical, returns point on segment", () => {
    const point = p(5, 2.5);
    const segment: LineSegment = {
      a: p(0, 0),
      b: p(0, 5),
      indexA: 0,
      indexB: 1,
    };

    const result = movePointToLineSegment(point, segment);
    
    expect(result).toStrictEqual(p(0,2.5));
  });
});
