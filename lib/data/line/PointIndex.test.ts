import { expect, test, describe } from "vitest";
import { indexDistance, indexesBetween } from "./PointIndex";

describe("indexDistance forward", () => {
  describe("from < to", () => {
    test("first and last index distance is total count - 2", () => {
      const totalCount = 10;
      const indexA = 0;
      const indexB = 9;

      expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(8);
    });

    test("indexes next to each other, the distance is 0", () => {
      const totalCount = 10;
      const indexA = 3;
      const indexB = 4;

      expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(0);
    });

    test("i and i + 3, the distance is 2", () => {
      const totalCount = 10;
      const indexA = 3;
      const indexB = 6;

      expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(2);
    });
  });

  describe("from > to", () => {
    test("first and last index flipped, the distance is 0", () => {
      const totalCount = 10;
      const indexA = 9;
      const indexB = 0;

      expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(0);
    });
    test("items next to each return totalCount - 2", () => {
      const totalCount = 10;
      const indexA = 6;
      const indexB = 5;

      expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(8);
    });
  });

  test("test large values", () => {
    const totalCount = 100;
    const indexA = 10;
    const indexB = 39;

    expect(indexDistance(indexA, indexB, totalCount).forward()).toBe(28);
  });
});

describe("indexDistance backward", () => {
  describe("from < to", () => {
    test("first and last index distance is 0", () => {
      const totalCount = 10;
      const indexA = 0;
      const indexB = 9;

      expect(indexDistance(indexA, indexB, totalCount).backward()).toBe(0);
    });

    test("indexes next to each other, the distance is totalCount - 2", () => {
      const totalCount = 10;
      const indexA = 3;
      const indexB = 4;

      expect(indexDistance(indexA, indexB, totalCount).backward()).toBe(8);
    });

    test("i and i + 3, the distance is 6", () => {
      const totalCount = 10;
      const indexA = 3;
      const indexB = 6;

      expect(indexDistance(indexA, indexB, totalCount).backward()).toBe(6);
    });
  });

  describe("from > to", () => {
    test("first and last index flipped, the distance is totalCount - 2", () => {
      const totalCount = 10;
      const indexA = 9;
      const indexB = 0;

      expect(indexDistance(indexA, indexB, totalCount).backward()).toBe(8);
    });
    test("items next to each return 0", () => {
      const totalCount = 10;
      const indexA = 6;
      const indexB = 5;

      expect(indexDistance(indexA, indexB, totalCount).backward()).toBe(0);
    });
  });
});

describe("indexesBetween", () => {
  test("when single point between - returns 3 points", () => {
    const pointCount = 10;
    expect(indexesBetween(1, 3, pointCount)).toStrictEqual([1, 2, 3]);
  });

  test("when all points between - returns all points", () => {
    const pointCount = 10;
    expect(indexesBetween(0, 9, pointCount)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  test("when points loop around", () => {
    const pointCount = 10;
    expect(indexesBetween(8, 0, pointCount)).toStrictEqual([8, 9, 0]);
  });
});
