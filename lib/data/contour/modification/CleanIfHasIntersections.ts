import findLongestIntersection from "../../line/findLongestIntersection";
import LineIntersection, { indexesToDelete, remainingIntersectionsOf, findIntersectingSegments } from "../../line/LineIntersection";
import { toLineSegments } from "../../line/LineSegment";
import { updateIndexAfterDelete } from "../../line/PointIndex";
import Point from "../../Point";
import ContourPoints, { modifyContour } from "../ContourPoints";

const cleanupIntersections = (
  contour: ContourPoints,
  intersections: LineIntersection[]
) => {
  const pointCount = contour.points.length;
  const intersection = findLongestIntersection(intersections, pointCount);

  const toDelete = indexesToDelete(intersection, pointCount);
  let updatedContour = modifyContour(contour).deleteByPointIndexes(toDelete);

  const updatedIndexOf = (i: number) => {
    return updateIndexAfterDelete(i, toDelete, pointCount);
  };
  updatedContour = modifyContour(updatedContour).addPoint(
    intersection.point,
    updatedIndexOf(intersection.a.indexB)
  );

  const remainingIntersections = remainingIntersectionsOf(
    intersections,
    toDelete,
    updatedContour.points.length
  );
  if (remainingIntersections.length > 0) {
    return cleanupIntersections(updatedContour, remainingIntersections);
  } else {
    return updatedContour;
  }
};

const cleanIfHasIntersections = (points: Point[]) => {
  const intersections = findIntersectingSegments(toLineSegments(points));
  if (intersections.length > 0) {
    const result = cleanupIntersections({ points: points }, intersections);
    // Run it twice, with large values, the deletion of points can introduce new lines.
    // Might be wise to cover with more tests for bugs and maybe add more points inbetween.
    return cleanIfHasIntersections(result.points);
  } else {
    return { points: points };
  }
};

export default cleanIfHasIntersections;
