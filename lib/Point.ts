import * as cv from "@techstark/opencv-js";
import { PaperDimensions } from "./opencv/PaperSettings";

type Point = {
  x: number;
  y: number;
};

export type ContourPoints = {
  points: Point[];
};

export const pointsFrom = (shape: cv.Mat): ContourPoints => {
  const points = [];
  for (let i = 0; i < shape.rows; i++) {
    const point = shape.row(i).data32S;
    const x = point[0];
    const y = point[1];
    points.push({ x, y });
  }
  return { points };
};

export const centerPoints = (
  contour: ContourPoints,
  paperDimensions: PaperDimensions
): ContourPoints => {
  const translateX = paperDimensions.width / 2;
  const translateY = paperDimensions.height / 2;
  return {
    points: contour.points.map((point) => {
      return { x: point.x - translateX, y: point.y - translateY };
    }),
  };
};

export const scalePoints = (
  contour: ContourPoints,
  scaleFactor: number
): ContourPoints => {
  return { points: scaleArray(contour.points, scaleFactor) };
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

export const minMaxValues = (points: Point[]) => {
  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;

  points.forEach((point) => {
    if (minX > point.x) {
      minX = point.x;
    }
    if (maxX < point.x) {
      maxX = point.x;
    }
    if (minY > point.y) {
      minY = point.y;
    }
    if (maxY < point.y) {
      maxY = point.y;
    }
  });
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

export default Point;
