import Point, { ContourPoints } from "@/lib/Point";
import { min } from "@techstark/opencv-js";
import { draw, Drawing, DrawingPen } from "replicad";

const drawContour = (points: Point[]): Drawing => {
  const drawPen = draw();
  const firstPoint = points[0];
  drawPen.movePointerTo([firstPoint.x, firstPoint.y]);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    drawPen.lineTo([point.x, point.y]);
  }
  return drawPen.close();
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

const findBase = (contourPoints: ContourPoints[]) => {
  let base = {
    value: contourPoints[0],
    minMax: minMaxValues(contourPoints[0].points),
  };
  for (let i = 1; i < contourPoints.length; i++) {
    const minMax = minMaxValues(contourPoints[i].points);
    if (
      minMax.minX < base.minMax.minX &&
      minMax.minY < base.minMax.minY &&
      minMax.maxX > base.minMax.maxX &&
      minMax.maxY > base.minMax.maxY
    ) {
      base = {
        value: contourPoints[i],
        minMax: minMax,
      };
    }
  }
  return base.value;
};

const drawShadow = (contourPoints: ContourPoints[], height: number) => {
  let basePoints = findBase(contourPoints);
  let base = drawContour(basePoints.points);

  for (let i = 0; i < contourPoints.length; i++) {
    if (contourPoints[i] == basePoints) continue;
    const hole = drawContour(contourPoints[i].points);
    base = base.cut(hole);
  }
  return base.sketchOnPlane("XY").extrude(height);
};

export default drawShadow;
