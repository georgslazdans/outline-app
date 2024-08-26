import ContourPoints from "../ContourPoints";
import Point, { add, scalar, subtract } from "../Point";

const findMiddleBetweenPoints = (contour: ContourPoints) => {
  return (indexA: number, indexB: number): Point => {
    const pointA = contour.points[indexA];
    const pointB = contour.points[indexB];
    const distance = subtract(pointB, pointA);
    return add(pointA, scalar(distance, 1 / 2));
  };
};

export default findMiddleBetweenPoints;
