import Point from "../../Point";
import ContourPoints from "../ContourPoints";

const scalePoints = (contour: ContourPoints) => {
  return (scaleFactor: number): ContourPoints => {
    return { points: scaleArray(contour.points, scaleFactor) };
  };
};

const scaleArray = (points: Point[], scaleFactor: number): Point[] => {
  const result: Point[] = [];
  points.forEach((it) =>
    result.push({
      x: it.x * scaleFactor,
      y: it.y * scaleFactor,
    })
  );
  return result;
};

export default scalePoints;
