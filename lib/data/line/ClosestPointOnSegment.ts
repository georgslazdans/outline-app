import Point from "../Point";

export type ClosestPointOnSegment = {
  point: Point;
  isEndpoint: boolean;
};

/**
 * Clamped projection of `point` onto the finite segment [a, b].
 *
 * Unlike `movePointToLineSegment` (which projects onto the *infinite* line
 * through a and b), the result here is clamped to the segment, so it never
 * falls outside [a, b]. `isEndpoint` is true when the projection landed on
 * `a` or `b` (i.e. the closest point is one of the segment's vertices).
 */
export const closestPointOnSegment = (
  point: Point,
  a: Point,
  b: Point
): ClosestPointOnSegment => {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lengthSq = abx * abx + aby * aby;

  if (lengthSq === 0) {
    return { point: { x: a.x, y: a.y }, isEndpoint: true };
  }

  const t = ((point.x - a.x) * abx + (point.y - a.y) * aby) / lengthSq;

  if (t <= 0) {
    return { point: { x: a.x, y: a.y }, isEndpoint: true };
  }
  if (t >= 1) {
    return { point: { x: b.x, y: b.y }, isEndpoint: true };
  }
  return { point: { x: a.x + t * abx, y: a.y + t * aby }, isEndpoint: false };
};

export default closestPointOnSegment;
