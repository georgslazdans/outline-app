import ContourPoints from "../ContourPoints";
import Point, { lengthOf, subtract } from "../../Point";
import LineSegment from "../../line/LineSegment";
import { nextIndex, previousIndex } from "../../line/PointIndex";

const dotProduct = (v1: Point, v2: Point): number => {
  return v1.x * v2.x + v1.y * v2.y;
};

const findLineSegmentClosestToPoint = (contour: ContourPoints) => {
  return (point: Point): LineSegment => {
    const { point: closestPoint, index: closestIndex } = contour.points
      .map((it, index) => {
        return {
          point: it,
          distance: lengthOf(it, point),
          index: index,
        };
      })
      .sort((a, b) => (a.distance < b.distance ? -1 : 1))[0];

    const previous = previousIndex(closestIndex, contour.points.length);
    const next = nextIndex(closestIndex, contour.points.length);

    const previousPoint = contour.points[previous];
    const nextPoint = contour.points[next];

    const toPoint = subtract(point, closestPoint);
    const toPrevious = subtract(previousPoint, closestPoint);
    const toNext = subtract(nextPoint, closestPoint);

    // Calculate the dot products to compare the directions
    const dotPrevious = dotProduct(toPrevious, toPoint);
    const dotNext = dotProduct(toNext, toPoint);

    // Choose the neighbor with the highest dot product (closest direction)
    if (dotPrevious > dotNext) {
      return {
        a: previousPoint,
        b: closestPoint,
        indexA: previous,
        indexB: closestIndex,
      };
    } else {
      return {
        a: closestPoint,
        b: nextPoint,
        indexA: closestIndex,
        indexB: next,
      };
    }
  };
};

export default findLineSegmentClosestToPoint;
