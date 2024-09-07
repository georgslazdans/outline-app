import { describe, expect, test } from "vitest";
import ContourPoints from "../ContourPoints";
import divideContour from "./DivideContour";
import SplitPoints from "@/components/editor/mode/contour/selection/SplitPoints";

const p = (x: number, y: number) => {
  return {
    x: x,
    y: y,
  };
};

const sp = (a: number, b: number): SplitPoints => {
  return {
    a: {
      contour: 0,
      point: a,
    },
    b: {
      contour: 0,
      point: b,
    },
  };
};

describe("divideContour", () => {
  test("split in half", () => {
    const contour: ContourPoints = {
      points: [
        p(0, 0), // 0
        p(0, 1), // 1
        p(1, 1), // 2
        p(2, 1), // 3
        p(2, 0), // 4
        p(1, 0), // 5
      ],
    };
    const splitPoints: SplitPoints[] = [sp(2, 5)];

    const expectedA = [p(1, 0), p(0, 0), p(0, 1), p(1, 1)];
    const expectedB = [p(1, 1), p(2, 1), p(2, 0), p(1, 0)];
    const contourFunction = divideContour([contour]);
    const result = contourFunction(splitPoints);
    expect(result[1][0].points).toStrictEqual(expectedA);
    expect(result[0][0].points).toStrictEqual(expectedB);
  });

  test("split in three parts", () => {
    const contour: ContourPoints = {
      points: [
        p(0, 0), // 0
        p(0, 1), // 1
        p(1, 1), // 2
        p(2, 1), // 3
        p(3, 1), // 4
        p(3, 0), // 5
        p(2, 0), // 6
        p(1, 0), // 7
      ],
    };
    const splitPoints: SplitPoints[] = [sp(2, 7), sp(3, 6)];

    const expectedA = [p(1, 0), p(0, 0), p(0, 1), p(1, 1)];
    const expectedB = [p(1, 1), p(2, 1), p(2, 0), p(1, 0)];
    const expectedC = [p(2, 1), p(3, 1), p(3, 0), p(2, 0)];
    const contourFunction = divideContour([contour]);
    const result = contourFunction(splitPoints);
    expect(result.length).toStrictEqual(3);
    expect(result[1][0].points).toStrictEqual(expectedA);
    expect(result[0][0].points).toStrictEqual(expectedB);
    expect(result[2][0].points).toStrictEqual(expectedC);
  });

  test("holes get included", () => {
    const hole = {
      points: [
        p(0.25, -0.5), // 0
        p(0.25, 0.5), // 1
        p(0.75, 0.5), // 2
        p(0.75, -0.5), // 3
      ],
    };
    const contour: ContourPoints = {
      points: [
        p(0, -1), // 0
        p(0, 1), // 1
        p(1, 1), // 2
        p(2, 1), // 3
        p(2, -1), // 4
        p(1, -1), // 5
      ],
    };
    const splitPoints: SplitPoints[] = [sp(2, 5)];

    const expectedA = [p(1, -1), p(0, -1), p(0, 1), p(1, 1)];
    const expectedB = [p(1, 1), p(2, 1), p(2, -1), p(1, -1)];
    const contourFunction = divideContour([contour, hole]);
    const result = contourFunction(splitPoints);
    expect(result[1][0].points).toStrictEqual(expectedA);
    expect(result[1][1].points).toStrictEqual(hole.points);
    expect(result[0][0].points).toStrictEqual(expectedB);
    expect(result[0].length).toStrictEqual(1);
  });

  test("big test", () => {
    const contour: ContourPoints = {
      points: [
        p(1, -1), // 0
        p(0, 0), // 1
        p(1, 1), // 2
        p(2, 1), // 3
        p(3, 1), // 4
        p(4, 1), // 5
        p(5, 1), // 6
        p(6, 1), // 7
        p(7, 1), // 8
        p(8, 1), // 9
        p(9, 1), // 10
        p(10, 1), // 11
        p(11, 0), // 12
        p(10, -1), // 13
        p(9, -1), // 14
        p(8, -1), // 15
        p(7, -1), // 16
        p(6, -1), // 17
        p(4, -1), // 18
        p(3, -1), // 19
        p(2, -1), // 20
        p(1, -1), // 21
      ],
    };
    const splitPoints: SplitPoints[] = [
      sp(3, 21),
      sp(5, 18),
      sp(8, 16),
      sp(10, 14),
      sp(11, 14),
    ];

    const contourFunction = divideContour([contour]);
    expect(contourFunction(splitPoints).length).toStrictEqual(6);
  });
});
