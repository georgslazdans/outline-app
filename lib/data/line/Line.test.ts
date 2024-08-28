import { describe, expect, test } from "vitest";
import Line, { lineOf } from "./Line";

const p = (x: number, y: number) => {
  return {
    x: x,
    y: y,
  };
};

describe("lineOf", () => {
  test("when line on x axis, returns slope 0 b 0", () => {
    const result = lineOf(p(0, 0), p(2, 0));
    expect(result).toStrictEqual({
      slope: 0,
      b: 0,
    } as Line);
  });

  test("when line on y axis, returns slope 0 b 0", () => {
    const result = lineOf(p(0, 0), p(0, 1));
    expect(result).toStrictEqual({
      slope: Infinity,
      b: NaN,
    } as Line);
  });
});
