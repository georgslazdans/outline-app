import { Direction, IndexDistance, indexDistance } from "./IndexDistance";
import LineIntersection from "./LineIntersection";

const shortestIndexDistance = (
  intersection: LineIntersection,
  pointCount: number
): IndexDistance => {
  const { a, b } = intersection;
  const forwardDistance = indexDistance(a.indexB, b.indexA, pointCount).forward();
  const backwardsDistance = indexDistance(b.indexB, a.indexA, pointCount).backward();
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

export default findLongestIntersection;
