import Point, { calculateNormal, centerPointOf } from "../Point";
import ContourPoints, { modifyContour } from "../ContourPoints";
import LineSegment, { toLineSegments } from "../line/LineSegment";
import LineIntersection, {
  findIntersectingSegments,
} from "../line/LineIntersection";

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

const indexDistance = (a: number, b: number, pointCount: number) => {
  if (b > a) {
    return b - a;
  } else {
    return pointCount - b + a;
  }
};

enum Direction {
  FORWARD,
  BACKWARD,
}
type IndexDistance = {
  distance: number;
  direction: Direction;
};

const shortestIndexDistance = (
  intersection: LineIntersection,
  pointCount: number
): IndexDistance => {
  const { a, b } = intersection;
  const forwardDistance = indexDistance(a.indexB, b.indexA, pointCount);
  const backwardsDistance = indexDistance(b.indexB, a.indexA, pointCount);
  if (forwardDistance <= backwardsDistance) {
    return {
      distance: forwardDistance,
      direction: Direction.FORWARD,
    };
  } else {
    return {
      distance: backwardsDistance,
      direction: Direction.BACKWARD,
    };
  }
};

const findLongestIntersection = (
  intersections: LineIntersection[],
  pointCount: number
): {
  intersection: LineIntersection;
  indexDistance: IndexDistance;
} => {
  return intersections
    .map((it) => {
      return {
        intersection: it,
        indexDistance: shortestIndexDistance(it, pointCount),
      };
    })
    .reduce((maxItem, currentItem) => {
      return currentItem.indexDistance.distance > maxItem.indexDistance.distance
        ? currentItem
        : maxItem;
    });
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

const indexesBetween = (
  intersection: LineIntersection,
  direction: Direction,
  pointCount: number
): number[] => {
  const addIndexes = (start: number, end: number) => {
    const indexes: number[] = [];

    if (end > start) {
      for (let i = start; i != end; i = i + 1) {
        indexes.push(i);
      }
    } else {
      for (let i = start; i != pointCount; i = i + 1) {
        indexes.push(i);
      }
      for (let i = 0; i != end; i = i + 1) {
        indexes.push(i);
      }
    }
    indexes.push(end);
    return indexes;
  };
  const startIndex =
    direction === Direction.FORWARD
      ? intersection.a.indexB
      : intersection.b.indexA;
  const endIndex =
    direction === Direction.FORWARD
      ? intersection.b.indexA
      : intersection.a.indexB;

  return addIndexes(startIndex, endIndex);
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

  const middlePoint = middlePointOf(intersection, direction);
  const index =
    direction == Direction.FORWARD
      ? intersection.b.indexA
      : intersection.a.indexB;
  let updatedContour = modifyContour(contour).addPoint(middlePoint, index);

  const indexesToDelete = indexesBetween(intersection, direction, pointCount);
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
