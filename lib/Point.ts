import * as cv from "@techstark/opencv-js";
import { ContourPoints } from "./opencv/StepResult";

type Point = {
  x: number;
  y: number;
};

export const pointsFrom = (shape: cv.Mat, scaleFactor = 1): ContourPoints => {
  const points = [];
  for (let i = 0; i < shape.rows; i++) {
    const point = shape.row(i).data32S;
    const x = point[0] / scaleFactor;
    const y = point[1] / scaleFactor;
    points.push({ x, y });
  }
  return { points };
};

export default Point;
