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

export const scaleAlongNormal = (
  contour: ContourPoints,
  scale: number
): ContourPoints => {
  const scaledPoints: Point[] = [];

  const calculateNormal = (p1: Point, p2: Point): Point => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: -dy / length, y: dx / length };
  }

  const n = contour.points.length;
  for (let i = 0; i < n; i++) {
    const prevPoint = contour.points[i === 0 ? n - 1 : i - 1];
    const currentPoint = contour.points[i];
    const nextPoint = contour.points[i === n - 1 ? 0 : i + 1];

    const normal1 = calculateNormal(prevPoint, currentPoint);
    const normal2 = calculateNormal(currentPoint, nextPoint);

    // Average the normals to get a smoother result. Or does it?
    const averagedNormal: Point = {
      x: (normal1.x + normal2.x) / 2,
      y: (normal1.y + normal2.y) / 2,
    };

    // Normalize the averaged normal
    const normalLength = Math.sqrt(
      averagedNormal.x * averagedNormal.x + averagedNormal.y * averagedNormal.y
    );
    const normalizedNormal: Point = {
      x: averagedNormal.x / normalLength,
      y: averagedNormal.y / normalLength,
    };

    // Scale the point along the normal
    const scaledPoint: Point = {
      x: currentPoint.x + normalizedNormal.x * scale,
      y: currentPoint.y + normalizedNormal.y * scale,
    };

    scaledPoints.push(scaledPoint);
  }

  return { points: scaledPoints };
};

export const scaleAlongNormalNew = (
  contour: ContourPoints,
  scale: number,
): ContourPoints => {
  const scaledPoints: Point[] = [...contour.points];

  function calculateNormal(p1: Point, p2: Point): Point {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: -dy / length, y: dx / length };
  }

  function doSegmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
    const cross = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    const d1 = cross(q1, q2, p1);
    const d2 = cross(q1, q2, p2);
    const d3 = cross(p1, p2, q1);
    const d4 = cross(p1, p2, q2);

    return (
      ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
    );
  }

  function scaleAndCheckIntersections(): boolean {
    let hasIntersections = false;
    const tempScaledPoints: Point[] = [];

    const n = scaledPoints.length;
    for (let i = 0; i < n; i++) {
      const prevIndex = i === 0 ? n - 1 : i - 1;
      const nextIndex = i === n - 1 ? 0 : i + 1;

      const prevPoint = tempScaledPoints[prevIndex] || scaledPoints[prevIndex];
      const currentPoint = scaledPoints[i];
      const nextPoint = scaledPoints[nextIndex];

      const normal1 = calculateNormal(prevPoint, currentPoint);
      const normal2 = calculateNormal(currentPoint, nextPoint);

      const averagedNormal: Point = {
        x: (normal1.x + normal2.x) / 2,
        y: (normal1.y + normal2.y) / 2,
      };

      const normalLength = Math.sqrt(
        averagedNormal.x * averagedNormal.x + averagedNormal.y * averagedNormal.y
      );
      const normalizedNormal: Point = {
        x: averagedNormal.x / normalLength,
        y: averagedNormal.y / normalLength,
      };

      const scaledPoint: Point = {
        x: currentPoint.x + normalizedNormal.x * scale,
        y: currentPoint.y + normalizedNormal.y * scale,
      };

      tempScaledPoints.push(scaledPoint);

      if (
        doSegmentsIntersect(prevPoint, currentPoint, currentPoint, scaledPoint) ||
        doSegmentsIntersect(currentPoint, nextPoint, currentPoint, scaledPoint)
      ) {
        hasIntersections = true;
        break;
      }
    }

    if (!hasIntersections) {
      for (let i = 0; i < n; i++) {
        scaledPoints[i] = tempScaledPoints[i];
      }
    }

    return hasIntersections;
  }

  let hasIntersections = scaleAndCheckIntersections();

  while (hasIntersections) {
    // Find and remove the point causing the intersection
    let pointRemoved = false;

    for (let i = 0; i < scaledPoints.length; i++) {
      const prevIndex = i === 0 ? scaledPoints.length - 1 : i - 1;
      const nextIndex = i === scaledPoints.length - 1 ? 0 : i + 1;

      const prevPoint = scaledPoints[prevIndex];
      const currentPoint = scaledPoints[i];
      const nextPoint = scaledPoints[nextIndex];

      const normal1 = calculateNormal(prevPoint, currentPoint);
      const normal2 = calculateNormal(currentPoint, nextPoint);

      const averagedNormal: Point = {
        x: (normal1.x + normal2.x) / 2,
        y: (normal1.y + normal2.y) / 2,
      };

      const normalLength = Math.sqrt(
        averagedNormal.x * averagedNormal.x + averagedNormal.y * averagedNormal.y
      );
      const normalizedNormal: Point = {
        x: averagedNormal.x / normalLength,
        y: averagedNormal.y / normalLength,
      };

      const scaledPoint: Point = {
        x: currentPoint.x + normalizedNormal.x * scale,
        y: currentPoint.y + normalizedNormal.y * scale,
      };

      if (
        doSegmentsIntersect(prevPoint, currentPoint, currentPoint, scaledPoint) ||
        doSegmentsIntersect(currentPoint, nextPoint, currentPoint, scaledPoint)
      ) {
        // Remove the current point causing intersection
        scaledPoints.splice(i, 1);
        pointRemoved = true;
        break;
      }
    }

    if (!pointRemoved) break;

    // Re-run the scaling check
    hasIntersections = scaleAndCheckIntersections();
  }

  return { points: scaledPoints };
};


const minMaxValues = (points: Point[]) => {
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

export const findLargestContourOf = (contourPoints: ContourPoints[]) => {
  let result = {
    value: contourPoints[0],
    minMax: minMaxValues(contourPoints[0].points),
  };
  for (let i = 1; i < contourPoints.length; i++) {
    const minMax = minMaxValues(contourPoints[i].points);
    if (
      minMax.minX < result.minMax.minX &&
      minMax.minY < result.minMax.minY &&
      minMax.maxX > result.minMax.maxX &&
      minMax.maxY > result.minMax.maxY
    ) {
      result = {
        value: contourPoints[i],
        minMax: minMax,
      };
    }
  }
  return result.value;
};

export default Point;
