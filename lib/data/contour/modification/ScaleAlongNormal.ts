import Point, { calculateNormal } from "../../Point";
import ContourPoints, { modifyContour } from "../ContourPoints";
import LineSegment, { toLineSegments } from "../../line/LineSegment";
import LineIntersection, {
  findIntersectingSegments,
  indexesToDelete,
} from "../../line/LineIntersection";
import findLongestIntersection from "../../line/findLongestIntersection";

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

const remainingIntersectionsOf = (
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

  const updateIndex = (i: number) => {
    const result = i - indexesToDelete.length;
    if (result >= 0) {
      return result;
    } else {
      return pointCount - result;
    }
  };

  const updateSegment = (segment: LineSegment): LineSegment => {
    return {
      ...segment,
      indexA: updateIndex(segment.indexA),
      indexB: updateIndex(segment.indexB),
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
  const intersection = findLongestIntersection(intersections, pointCount);
  
  // Add point before deletion, so we don't mess up delete index counting
  const index = intersection.b.indexA + 1;
  let updatedContour = modifyContour(contour).addPoint(
    intersection.point,
    index
  );

  const toDelete = indexesToDelete(intersection, pointCount);
  updatedContour = deleteContainingIndexes(updatedContour, toDelete);

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
    const intersections = findIntersectingSegments(
      toLineSegments(scaledPoints)
    );
    if (intersections.length > 0) {
      console.log("Cleaning up intersections!");
      return cleanupIntersections({ points: scaledPoints }, intersections);
    } else {
      return { points: scaledPoints };
    }
  };
};

export default scaleAlongNormal;
