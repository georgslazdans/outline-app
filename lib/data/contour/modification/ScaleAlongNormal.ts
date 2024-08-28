import Point, { calculateNormal } from "../../Point";
import ContourPoints, { modifyContour } from "../ContourPoints";
import { toLineSegments } from "../../line/LineSegment";
import LineIntersection, {
  findIntersectingSegments,
  indexesToDelete,
  remainingIntersectionsOf,
} from "../../line/LineIntersection";
import findLongestIntersection from "../../line/findLongestIntersection";
import { updateIndexAfterDelete } from "../../line/PointIndex";

const calculatePointsNormal = (
  prevPoint: Point,
  currentPoint: Point,
  nextPoint: Point
): Point => {
  const normal1 = calculateNormal(prevPoint, currentPoint);
  const normal2 = calculateNormal(currentPoint, nextPoint);

  const averagedNormal: Point = {
    x: (normal1.x + normal2.x) / 2,
    y: (normal1.y + normal2.y) / 2,
  };

  const normalLength = Math.sqrt(
    averagedNormal.x * averagedNormal.x + averagedNormal.y * averagedNormal.y
  );

  return {
    x: averagedNormal.x / normalLength,
    y: averagedNormal.y / normalLength,
  };
};

const scalePoints = (points: Point[], scale: number): Point[] => {
  const scaledPoints: Point[] = [];

  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prevPoint = points[i === 0 ? n - 1 : i - 1];
    const currentPoint = points[i];
    const nextPoint = points[i === n - 1 ? 0 : i + 1];

    const normal = calculatePointsNormal(prevPoint, currentPoint, nextPoint);

    const scaledPoint: Point = {
      x: currentPoint.x + normal.x * scale,
      y: currentPoint.y + normal.y * scale,
    };

    scaledPoints.push(scaledPoint);
  }

  return scaledPoints;
};

const deleteContainingIndexes = (
  contour: ContourPoints,
  indexesToDelete: number[]
) => {
  let updatedContour = contour;
  for (let i = indexesToDelete.length - 1; i >= 0; i--) {
    updatedContour = modifyContour(updatedContour).deletePoint(
      indexesToDelete[i]
    );
  }
  return updatedContour;
};

const cleanupIntersections = (
  contour: ContourPoints,
  intersections: LineIntersection[]
) => {
  const pointCount = contour.points.length;
  const intersection = findLongestIntersection(intersections, pointCount);

  const toDelete = indexesToDelete(intersection, pointCount);
  let updatedContour = deleteContainingIndexes(contour, toDelete);

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

const scaleAlongNormal = (contour: ContourPoints) => {
  return (scale: number): ContourPoints => {
    const scaledPoints = scalePoints(contour.points, scale);

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
    return cleanIfHasIntersections(scaledPoints);
  };
};

export default scaleAlongNormal;
