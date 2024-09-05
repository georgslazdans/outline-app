import Point from "../Point";
import LineSegment from "./LineSegment";

type Line = {
  slope: number;
  b: number;
};

const getSlope = (a: Point, b: Point) => (b.y - a.y) / (b.x - a.x);

export const lineOf = (a: Point, b: Point): Line => {
  const slope = getSlope(a, b);
  return {
    slope: slope,
    b: b.y - slope * b.x,
  };
};

export const lineOfSegment = (a: LineSegment): Line => lineOf(a.a, a.b);

export const linesCrossPointOf = (a: Line, b: Line): Point | undefined => {
  if (a.slope != b.slope) {
    return {
      x: (a.b - b.b) / (b.slope - a.slope),
      y: (a.slope * (a.b - b.b)) / (b.slope - a.slope) + a.b,
    };
  }
};

export const getPointOnLineFromY = (y: number, line: Line): Point => {
  return {
    x: (y - line.b) / line.slope,
    y,
  };
};

export const getPointOnLineFromX = (x: number, line: Line): Point => {
  return {
    x:x,
    y: line.slope * x + line.b,
  };
};

export const isLineVertical = (line: Line) => {
  return line.slope == Infinity || line.slope == -Infinity;
};

export default Line;
