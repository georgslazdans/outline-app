import SplitPoints from "@/components/editor/mode/contour/selection/SplitPoints";
import ContourPoints, { queryContourList } from "../../ContourPoints";
import Point, { minMaxValues } from "../../../Point";
import deepEqual from "@/lib/utils/Objects";

const findNextSplitPoint = (
  index: number,
  splitPoints: SplitPoints[]
): SplitPoints | undefined => {
  const higherSplitPoints: SplitPoints[] = splitPoints.filter(
    (it) => it.a.point > index || it.b.point > index
  );
  const sortedHigherPoints: SplitPoints[] = higherSplitPoints.sort(
    (it1, it2) => {
      const point1 = Math.min(
        it1.a.point > index ? it1.a.point : Infinity,
        it1.b.point > index ? it1.b.point : Infinity
      );
      const point2 = Math.min(
        it2.a.point > index ? it2.a.point : Infinity,
        it2.b.point > index ? it2.b.point : Infinity
      );
      return point1 - point2;
    }
  );
  if (sortedHigherPoints.length > 0) {
    return sortedHigherPoints[0];
  }
  const wrapAroundSplitPoints: SplitPoints[] = splitPoints.filter(
    (it) => it.a.point <= index || it.b.point <= index
  );
  const sortedWrapAroundPoints: SplitPoints[] = wrapAroundSplitPoints.sort(
    (it1, it2) => {
      const point1 = Math.min(it1.a.point, it1.b.point);
      const point2 = Math.min(it2.a.point, it2.b.point);
      return point1 - point2;
    }
  );
  return sortedWrapAroundPoints.length > 0
    ? sortedWrapAroundPoints[0]
    : undefined;
};

const isEqual = (
  split: SplitPoints,
  startIndex: number,
  endIndex: number
): boolean => {
  return (
    (split.a.point == startIndex && split.b.point == endIndex) ||
    (split.b.point == startIndex && split.a.point == endIndex)
  );
};

const isInRange = (
  splitPoint: SplitPoints,
  startIndex: number,
  endIndex: number
): boolean => {
  if (splitPoint.a.point > startIndex && splitPoint.b.point < endIndex) {
    return true;
  }
  return false;
};

const findHolesFor = (
  contour: ContourPoints,
  holes: ContourPoints[]
): ContourPoints[] => {
  const contourMinMax = minMaxValues(contour.points);
  return holes.filter((it) => {
    const holeMinMax = minMaxValues(it.points);
    return (
      contourMinMax.minX < holeMinMax.minX &&
      contourMinMax.minY < holeMinMax.minY &&
      contourMinMax.maxX > holeMinMax.maxX &&
      contourMinMax.maxY > holeMinMax.maxY
    );
  });
};

const divideContour = (contour: ContourPoints[]) => {
  return (splitPoints: SplitPoints[]): ContourPoints[][] => {
    const getSegment = (
      startIndex: number,
      endIndex: number,
      points: Point[]
    ): Point[] => {
      const otherPoints = splitPoints.filter(
        (it) => !isEqual(it, startIndex, endIndex)
      );
      if (startIndex <= endIndex) {
        const nextSplitPoint = findNextSplitPoint(startIndex, otherPoints);
        if (nextSplitPoint && isInRange(nextSplitPoint, startIndex, endIndex)) {
          const smallestIndex = Math.min(
            nextSplitPoint.a.point,
            nextSplitPoint.b.point
          );
          const largestIndex = Math.max(
            nextSplitPoint.a.point,
            nextSplitPoint.b.point
          );
          return [
            ...points.slice(startIndex, smallestIndex + 1),
            ...points.slice(largestIndex, endIndex + 1),
          ];
        } else {
          return points.slice(startIndex, endIndex + 1);
        }
      } else {
        return [...points.slice(startIndex), ...points.slice(0, endIndex + 1)];
      }
    };

    const splitContours: ContourPoints[] = [];
    const { contour: outline } =
      queryContourList(contour).findLargestContourOf();
    const holes = contour.filter((it) => it != outline);

    const containsResult = (points: ContourPoints) => {
      return !!splitContours.find((it) => deepEqual(it, points));
    };

    const addSegment = (startIndex: number, endIndex: number) => {
      const segment = getSegment(startIndex, endIndex, outline.points);
      const segmentContour = { points: segment };
      if (!containsResult(segmentContour)) {
        splitContours.push(segmentContour);
      }
    };

    splitPoints
      .sort((a, b) => (a.a.point < b.a.point ? -1 : 1))
      .forEach((it, index) => {
        const { a, b } = it;
        addSegment(a.point, b.point);
        if (index == 0) {
          addSegment(b.point, a.point);
        }
      });

    return splitContours.map((it) => [it, ...findHolesFor(it, holes)]);
  };
};

export default divideContour;
