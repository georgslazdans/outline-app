import Point from "../Point";

type LineSegment = {
  a: Point;
  indexA: number;
  b: Point;
  indexB: number;
};

const nextIndex = (i: number, length: number) => (i === length - 1 ? 0 : i + 1);

export const toLineSegments = (points: Point[]): LineSegment[] => {
  const segments: LineSegment[] = [];
  for (let i = 0; i < points.length; i++) {
    const bIndex = nextIndex(i, points.length);
    segments.push({
      a: points[i],
      indexA: i,
      b: points[bIndex],
      indexB: bIndex,
    });
  }
  return segments;
};

const doSegmentsIntersect = (
  p1: Point,
  p2: Point,
  q1: Point,
  q2: Point
): boolean => {
  const cross = (a: Point, b: Point, c: Point) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const d1 = cross(q1, q2, p1);
  const d2 = cross(q1, q2, p2);
  const d3 = cross(p1, p2, q1);
  const d4 = cross(p1, p2, q2);

  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
};

export const doLineSegmentsIntersect = (
  segmentA: LineSegment,
  segmentB: LineSegment
): boolean => {
  return doSegmentsIntersect(segmentA.a, segmentA.b, segmentB.a, segmentB.b);
};

export const doIntersect = (segments: LineSegment[]) => {};

export default LineSegment;
