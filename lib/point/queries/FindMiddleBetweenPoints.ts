import ContourPoints from "../ContourPoints";
import Point, { centerPointOf } from "../Point";

const findMiddleBetweenPoints = (contour: ContourPoints) => {
  return (indexA: number, indexB: number): Point => {
    const pointA = contour.points[indexA];
    const pointB = contour.points[indexB];
    return centerPointOf(pointA, pointB);
  };
};

export default findMiddleBetweenPoints;
