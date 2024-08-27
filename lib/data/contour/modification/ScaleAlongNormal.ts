import Point, { calculateNormal, centerPointOf } from "../../Point";
import ContourPoints, { modifyContour } from "../ContourPoints";
import LineSegment, { toLineSegments } from "../../line/LineSegment";
import LineIntersection, {
  findIntersectingSegments,
} from "../../line/LineIntersection";
import findLongestIntersection from "../../line/findLongestIntersection";
import { Direction, indexesBetween, indexesOf } from "../../line/IndexDistance";

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

const middlePointOf = (
  intersection: LineIntersection,
  direction: Direction
) => {
  if (direction == Direction.FORWARD) {
    return centerPointOf(intersection.a.b, intersection.b.a);
  } else {
    return centerPointOf(intersection.b.a, intersection.a.b);
  }
};

const remainingIntersectionsOf = (
  intersections: LineIntersection[],
  indexesToDelete: number[]
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
  return intersections.filter((it) => !deleteContainsIntersection(it));
};

const deleteContainingIndexes = (
  contour: ContourPoints,
  indexesToDelete: number[]
) => {
  let updatedContour = contour;
  for (let i = 0; i < indexesToDelete.length; i++) {
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
  const { intersection, indexDistance } = findLongestIntersection(
    intersections,
    pointCount
  );
  const { direction } = indexDistance;
  const index =
    direction == Direction.FORWARD
      ? intersection.b.indexA
      : intersection.a.indexB;
  let updatedContour = modifyContour(contour).addPoint(
    intersection.point,
    index
  );

  const { startIndex, endIndex } = indexesOf(intersection, direction);
  const indexesToDelete = indexesBetween(startIndex, endIndex, pointCount);
  updatedContour = deleteContainingIndexes(updatedContour, indexesToDelete);

  const remainingIntersections = remainingIntersectionsOf(
    intersections,
    indexesToDelete
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
    const intersections = findIntersectingSegments(
      toLineSegments(scaledPoints)
    );
    if (intersections.length > 0) {
      return cleanupIntersections({ points: scaledPoints }, intersections);
    } else {
      return { points: scaledPoints };
    }
  };
};

export default scaleAlongNormal;
