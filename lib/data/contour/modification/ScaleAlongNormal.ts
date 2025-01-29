import Point, { normalOf } from "../../Point";
import ContourPoints from "../ContourPoints";
import _cleanIfHasIntersections from "./CleanIfHasIntersections";

const calculatePointsNormal = (
  prevPoint: Point,
  currentPoint: Point,
  nextPoint: Point
): Point => {
  const normal1 = normalOf(prevPoint, currentPoint);
  const normal2 = normalOf(currentPoint, nextPoint);

  const averagedNormal: Point = {
    x: (normal1.x + normal2.x) / 2,
    y: (normal1.y + normal2.y) / 2,
  };

  const normalLength = Math.sqrt(
    averagedNormal.x * averagedNormal.x + averagedNormal.y * averagedNormal.y
  );

  return {
    x: averagedNormal.x / normalLength,
    y: averagedNormal.y / normalLength,
  };
};

const scalePoints = (points: Point[], scale: number): Point[] => {
  const scaledPoints: Point[] = [];

  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prevPoint = points[i === 0 ? n - 1 : i - 1];
    const currentPoint = points[i];
    const nextPoint = points[i === n - 1 ? 0 : i + 1];

    const normal = calculatePointsNormal(prevPoint, currentPoint, nextPoint);

    const scaledPoint: Point = {
      x: currentPoint.x + normal.x * scale,
      y: currentPoint.y + normal.y * scale,
    };

    scaledPoints.push(scaledPoint);
  }

  return scaledPoints;
};

const scaleStep = 0.01;

const scaleAlongNormal = (contour: ContourPoints) => {
  return (scale: number): ContourPoints => {
    let remainingScale = scale;
    let scaledPoints = contour.points;

    while (Math.abs(remainingScale) >= Math.abs(scaleStep)) {
      const step = Math.sign(remainingScale) * scaleStep; // Determine the direction and size of the step
      scaledPoints = scalePoints(scaledPoints, step);
      scaledPoints = _cleanIfHasIntersections(scaledPoints).points;
      remainingScale -= step;
    }

    if (remainingScale !== 0) {
      // Apply the remainder of the scaling
      scaledPoints = scalePoints(scaledPoints, remainingScale);
      scaledPoints = _cleanIfHasIntersections(scaledPoints).points;
    }
    return { points: scaledPoints };
  };
};

export default scaleAlongNormal;
