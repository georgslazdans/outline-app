import ContourPoints from "../ContourPoints";
import Point, { add, magnitudeOf, subtract } from "../../Point";
import LineSegment, {
  normalDistanceToSegment,
  toLineSegments,
} from "../../line/LineSegment";

const forPoint = (point: Point) => {
  return {
    combinedDistanceMagnitude: (a?: Point, b?: Point) => {
      if (a && b) {
        const distance = add(subtract(a, point), subtract(b, point));
        return magnitudeOf(distance);
      }
    },
  };
};

const findLineSegmentClosestToPoint = (contour: ContourPoints) => {
  return (point: Point): LineSegment => {
    const magnitudeDistance = (segment: LineSegment) => {
      return forPoint(point).combinedDistanceMagnitude(segment.a, segment.b)!;
    };
    const segments = toLineSegments(contour.points).map((it) => {
      return {
        segment: it,
        distance: normalDistanceToSegment(it).of(point),
        magnitudeDistance: magnitudeDistance(it),
      };
    });
    const minDistance = segments.sort((a, b) =>
      a.distance < b.distance ? -1 : 1
    )[0].distance;

    return segments
      .filter((it) => it.distance <= minDistance)
      .sort((a, b) => (a.magnitudeDistance < b.magnitudeDistance ? -1 : 1))[0]
      .segment;
  };
};

export default findLineSegmentClosestToPoint;
