import { findIntersectingSegments } from "@/lib/data/line/LineIntersection";
import { toLineSegments } from "@/lib/data/line/LineSegment";
import ContourIndex, { pointByIndex } from "../../ContourIndex";
import ContourPoints, { queryContourList } from "../../ContourPoints";
import SplitPoints from "@/components/editor/mode/contour/selection/SplitPoints";

const asSegments = (
  a: ContourIndex,
  b: ContourIndex,
  contour: ContourPoints[]
) => {
  const pointA = pointByIndex(contour, a);
  const pointB = pointByIndex(contour, b);
  const segments = toLineSegments([pointA, pointB]);
  return segments;
};

const isValidSplitPoint = (contourPoints: ContourPoints[]) => {
  return (a: ContourIndex, b: ContourIndex, splitPoints: SplitPoints[]): boolean => {
    const { contour: outline, index: outlineIndex } =
      queryContourList(contourPoints).findLargestContourOf();
    const holes = contourPoints.filter((it) => it != outline);
    const segments = asSegments(a, b, contourPoints);

    const isOnOutline = (a: ContourIndex, b: ContourIndex) => {
      return a.contour == outlineIndex && b.contour == outlineIndex;
    };

    const intersectsWithHoles = (): boolean => {
      const intersecting = holes
        .map((it) => toLineSegments(it.points))
        .find(
          (it) => findIntersectingSegments([...segments, ...it]).length > 0
        );
      const result = !!intersecting && intersecting.length > 0;
      return result;
    };

    const intersectsWithExistingLines = (
    ): boolean => {
      const existingSegments = splitPoints.map((it) => {
        return toLineSegments([
          pointByIndex(contourPoints, it.a),
          pointByIndex(contourPoints, it.b),
        ]);
      });
    
      const intersecting = existingSegments.find(
        (it) => findIntersectingSegments([...segments, ...it]).length > 0
      );
      const result = !!intersecting && intersecting.length > 0;
      return result;
    };

    return (
      isOnOutline(a, b) &&
      !intersectsWithExistingLines() &&
      !intersectsWithHoles()
    );
  };
};

export default isValidSplitPoint;
