import ContourPoints from "../ContourPoints";
import Point, { centerPointOf } from "../../Point";

const _findMiddleBetweenPoints = (contour: ContourPoints) => {
  return (indexA: number, indexB: number): Point => {
    const pointA = contour.points[indexA];
    const pointB = contour.points[indexB];
    return centerPointOf(pointA, pointB);
  };
};

export default _findMiddleBetweenPoints;
