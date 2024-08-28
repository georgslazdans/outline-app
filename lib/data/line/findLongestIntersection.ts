import { indexDistance } from "./IndexDistance";
import LineIntersection from "./LineIntersection";

export enum Direction {
  FORWARD,
  BACKWARD,
}

export type IndexDistance = {
  distance: number;
  direction: Direction;
};

const shortestIndexDistance = (
  intersection: LineIntersection,
  pointCount: number
): IndexDistance => {
  const { a, b } = intersection;
  const forwardDistance = indexDistance(
    a.indexB,
    b.indexA,
    pointCount
  ).forward();
  const backwardsDistance = indexDistance(
    a.indexA,
    b.indexB,
    pointCount
  ).backward();
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
): LineIntersection => {
  const largestDistance = intersections
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
  if (largestDistance.indexDistance.direction == Direction.BACKWARD) {
    const { a, b } = largestDistance.intersection;
    return {
      ...largestDistance.intersection,
      a: b,
      b: a,
    };
  }
  return largestDistance.intersection;
};

export default findLongestIntersection;
