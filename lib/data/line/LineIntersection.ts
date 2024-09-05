import Point from "../Point";
import { indexesBetween, updateIndexAfterDelete } from "./PointIndex";
import { lineOfSegment, linesCrossPointOf } from "./Line";
import LineSegment, { doLineSegmentsIntersect } from "./LineSegment";

type LineIntersection = {
  a: LineSegment;
  b: LineSegment;
  point: Point;
};

const getCrossPointOf = (a: LineSegment, b: LineSegment): Point => {
  return linesCrossPointOf(lineOfSegment(a), lineOfSegment(b))!;
};

export const findLowestPointIndexOf = (line: LineIntersection) => {
  const lowestIndex = (segment: LineSegment) =>
    Math.min(segment.indexA, segment.indexB);
  return Math.min(lowestIndex(line.a), lowestIndex(line.b));
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
    return [
      ...intersectingLines,
      ...findIntersectingSegments(segments.slice(1)),
    ];
  }
};

export const indexesToDelete = (
  intersection: LineIntersection,
  pointCount: number
): number[] => {
  const startIndex = intersection.a.indexB;
  const endIndex = intersection.b.indexA;
  const indexes = indexesBetween(startIndex, endIndex, pointCount);
  return indexes.sort((a,b) => a < b ? -1 : 1);
};

export const remainingIntersectionsOf = (
  intersections: LineIntersection[],
  indexesToDelete: number[],
  pointCount: number
): LineIntersection[] => {
  const deleteContainsSegment = (segment: LineSegment): boolean => {
    return (
      indexesToDelete.includes(segment.indexA) ||
      indexesToDelete.includes(segment.indexB)
    );
  };
  const deleteContainsIntersection = (
    intersection: LineIntersection
  ): boolean => {
    return (
      deleteContainsSegment(intersection.a) ||
      deleteContainsSegment(intersection.b)
    );
  };

  const updateSegment = (segment: LineSegment): LineSegment => {
    return {
      ...segment,
      indexA: updateIndexAfterDelete(segment.indexA, indexesToDelete, pointCount),
      indexB: updateIndexAfterDelete(segment.indexB, indexesToDelete, pointCount),
    };
  };

  const updateLineIndex = (line: LineIntersection): LineIntersection => {
    let updatedLine = { ...line };
    updatedLine.a = updateSegment(line.a);
    updatedLine.b = updateSegment(line.b);
    return updatedLine;
  };

  return intersections
    .filter((it) => !deleteContainsIntersection(it))
    .map(updateLineIndex);
};

export default LineIntersection;
