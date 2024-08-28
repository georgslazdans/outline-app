import { describe, expect, test } from "vitest";
import LineIntersection, {
  indexesToDelete,
  remainingIntersectionsOf,
} from "./LineIntersection";

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

describe("remainingIntersectionsOf", () => {
  test("when single point between - returns 3 points", () => {
    const pointCount = 10;
    const intersections = [
      testIntersection().withPointAIndex(1, 2).withPointBIndex(3, 4),
    ];

    expect(
      remainingIntersectionsOf(intersections, [2, 3], pointCount)
    ).toStrictEqual([]);
  });
});

describe("indexesToDelete", () => {
  test("returns indexes closest to each other and all between", () => {
    const pointCount = 10;
    const intersections = testIntersection()
      .withPointAIndex(1, 2)
      .withPointBIndex(4, 5);

    expect(indexesToDelete(intersections, pointCount)).toStrictEqual([2, 3, 4]);
  });

  test("when indexes loop around then returned array is sorted", () => {
    const pointCount = 10;
    const intersections = testIntersection()
      .withPointAIndex(8, 9)
      .withPointBIndex(1, 2);
      
    expect(indexesToDelete(intersections, pointCount)).toStrictEqual([0, 1, 9]);
  });
});
