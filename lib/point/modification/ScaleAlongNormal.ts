import Point from "../Point";
import ContourPoints from "../ContourPoints";

const scaleAlongNormal = (
  contour: ContourPoints,
  scale: number
): ContourPoints => {
  const scaledPoints: Point[] = [];

  const calculateNormal = (p1: Point, p2: Point): Point => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: -dy / length, y: dx / length };
  };

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

const scaleAlongNormalNew = (contour: ContourPoints) => {
  return (scale: number): ContourPoints => {
    const scaledPoints: Point[] = [...contour.points];

    function calculateNormal(p1: Point, p2: Point): Point {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      return { x: -dy / length, y: dx / length };
    }

    function doSegmentsIntersect(
      p1: Point,
      p2: Point,
      q1: Point,
      q2: Point
    ): boolean {
      const cross = (a: Point, b: Point, c: Point) =>
        (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
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

        const prevPoint =
          tempScaledPoints[prevIndex] || scaledPoints[prevIndex];
        const currentPoint = scaledPoints[i];
        const nextPoint = scaledPoints[nextIndex];

        const normal1 = calculateNormal(prevPoint, currentPoint);
        const normal2 = calculateNormal(currentPoint, nextPoint);

        const averagedNormal: Point = {
          x: (normal1.x + normal2.x) / 2,
          y: (normal1.y + normal2.y) / 2,
        };

        const normalLength = Math.sqrt(
          averagedNormal.x * averagedNormal.x +
            averagedNormal.y * averagedNormal.y
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
          doSegmentsIntersect(
            prevPoint,
            currentPoint,
            currentPoint,
            scaledPoint
          ) ||
          doSegmentsIntersect(
            currentPoint,
            nextPoint,
            currentPoint,
            scaledPoint
          )
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
          averagedNormal.x * averagedNormal.x +
            averagedNormal.y * averagedNormal.y
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
          doSegmentsIntersect(
            prevPoint,
            currentPoint,
            currentPoint,
            scaledPoint
          ) ||
          doSegmentsIntersect(
            currentPoint,
            nextPoint,
            currentPoint,
            scaledPoint
          )
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
};

export default scaleAlongNormalNew;
