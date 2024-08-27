import Point from "../point/Point";
import Line, { lineOf, lineOfSegment, linesCrossPointOf } from "./Line";
import LineSegment, { doLineSegmentsIntersect } from "./LineSegment";

type LineIntersection = {
  a: LineSegment;
  b: LineSegment;
  point: Point;
};

const getCrossPointOf = (a: LineSegment, b: LineSegment): Point => {
  return linesCrossPointOf(lineOfSegment(a), lineOfSegment(b))!;
};

export const findIntersectingSegments = (
  segments: LineSegment[]
): LineIntersection[] => {
  const intersectingLines: LineIntersection[] = [];
  const baseSegment = segments[0];
  for (let i = 1; i < segments.length; i++) {
    const currentSegment = segments[i];
    if (doLineSegmentsIntersect(baseSegment, currentSegment)) {
      intersectingLines.push({
        a: baseSegment,
        b: currentSegment,
        point: getCrossPointOf(baseSegment, currentSegment),
      });
    }
  }

  if (segments.length <= 2) {
    return intersectingLines;
  } else {
    return [...intersectingLines, ...findIntersectingSegments(segments.slice(1))];
  }
};

export default LineIntersection;
