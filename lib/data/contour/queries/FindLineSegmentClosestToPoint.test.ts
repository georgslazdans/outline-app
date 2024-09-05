import { describe, expect, test } from "vitest";
import findLineSegmentClosestToPoint from "./FindLineSegmentClosestToPoint";
import ContourPoints from "../ContourPoints";
import LineSegment from "../../line/LineSegment";

const p = (x: number, y: number) => {
  return {
    x: x,
    y: y,
  };
};

describe("findLineSegmentClosestToPoint", () => {
  test("when point on segment, return that segment", () => {
    const contour: ContourPoints = {
      points: [p(0, 0), p(2, 2), p(4, 2), p(4, 0), p(-2, -2)],
    };
    const point = p(1, 1);

    const contourFunction = findLineSegmentClosestToPoint(contour);
    expect(contourFunction(point)).toStrictEqual({
      a: p(0, 0),
      b: p(2, 2),
      indexA: 0,
      indexB: 1,
    } as LineSegment);
  });

  test("when above contour, return closest segment", () => {
    const contour: ContourPoints = {
      points: [p(0, 0), p(2, 2), p(4, 2), p(4, 0), p(-2, -2)],
    };
    const point = p(0, 2);

    const contourFunction = findLineSegmentClosestToPoint(contour);
    expect(contourFunction(point)).toStrictEqual({
      a: p(0, 0),
      b: p(2, 2),
      indexA: 0,
      indexB: 1,
    } as LineSegment);
  });

  test("when clicked on a large straight line, returns that line", () => {
    const contour: ContourPoints = {
      points: [p(0, 0), p(1, 0), p(2, -1), p(3, 0), p(13, 0), p(13, -20), p(0,-20)],
    };
    const point = p(4, 0);

    const contourFunction = findLineSegmentClosestToPoint(contour);
    expect(contourFunction(point)).toStrictEqual({
      a: p(3, 0),
      b: p(13, 0),
      indexA: 3,
      indexB: 4,
    } as LineSegment);
  });
});
