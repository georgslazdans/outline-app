import * as cv from "@techstark/opencv-js";

type Point = {
  x: number;
  y: number;
};

export const pointsFrom = (shape: cv.Mat, scale: number = 1): Point[] => {
  const points = [];
  for (let i = 0; i < shape.rows; i++) {
    const point = shape.row(i).data32S;
    const x = point[0] / scale;
    const y = point[1] / scale;
    points.push({ x, y });
  }
  return points;
};

export default Point;
