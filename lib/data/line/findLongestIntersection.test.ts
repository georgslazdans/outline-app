import { describe, expect, test } from "vitest";
import LineIntersection from "./LineIntersection";
import findLongestIntersection from "./findLongestIntersection";

const testIntersection = () => {
  return {
    withPointAIndex: (indexA: number, indexB: number) => {
      return {
        withPointBIndex: (
          bIndexA: number,
          bIndexB: number
        ): LineIntersection => {
          return {
            a: {
              indexA: indexA,
              indexB: indexB,
              a: { x: 0, y: 0 },
              b: { x: 0, y: 0 },
            },
            b: {
              indexA: bIndexA,
              indexB: bIndexB,
              a: { x: 0, y: 0 },
              b: { x: 0, y: 0 },
            },
            point: { x: 0, y: 0 },
          };
        },
      };
    },
  };
};

describe("findLargestIntersection", () => {
  test("largestPoint return when having cross points inside", () => {
    const pointCount = 100;
    const largestPoint: LineIntersection = testIntersection()
      .withPointAIndex(10, 11)
      .withPointBIndex(30, 31);
    const b: LineIntersection = testIntersection()
      .withPointAIndex(20, 21)
      .withPointBIndex(22, 23);
    const c: LineIntersection = testIntersection()
      .withPointAIndex(19, 20)
      .withPointBIndex(23, 24);
    const intersections = [largestPoint, b, c];
    const result = findLongestIntersection(intersections, pointCount);
    expect(result).toStrictEqual(largestPoint);
  });

  test("largestPoint return when point loops around 0", () => {
    const pointCount = 100;
    const largestPoint: LineIntersection = testIntersection()
      .withPointAIndex(90, 91)
      .withPointBIndex(20, 21);
    const b: LineIntersection = testIntersection()
      .withPointAIndex(10, 11)
      .withPointBIndex(15, 16);
    const c: LineIntersection = testIntersection()
      .withPointAIndex(5, 6)
      .withPointBIndex(20, 21);
    const intersections = [largestPoint, b, c];
    const result = findLongestIntersection(intersections, pointCount);
    expect(result).toStrictEqual(largestPoint);
  });

  test("when shortest distance is backwards, then result segments are flipped", () => {
    const pointCount = 100;
    const largestPoint: LineIntersection = testIntersection()
      .withPointAIndex(20, 21)
      .withPointBIndex(90, 91);
    const b: LineIntersection = testIntersection()
      .withPointAIndex(10, 11)
      .withPointBIndex(15, 16);
    const c: LineIntersection = testIntersection()
      .withPointAIndex(5, 6)
      .withPointBIndex(20, 21);
    const intersections = [largestPoint, b, c];
    const result = findLongestIntersection(intersections, pointCount);

    const expectedFlippedSegments = testIntersection()
      .withPointAIndex(90, 91)
      .withPointBIndex(20, 21);

    expect(result).toStrictEqual(expectedFlippedSegments);
  });
});
