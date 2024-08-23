import Point, { ContourPoints, findLargestContourOf } from "@/lib/Point";
import { draw, Drawing } from "replicad";
import ReplicadModelData from "./ReplicadModelData";

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

const drawShadow = (contourPoints: ContourPoints[], height: number): ReplicadModelData => {
  let basePoints = findLargestContourOf(contourPoints);
  let base = drawContour(basePoints.points);

  for (let i = 0; i < contourPoints.length; i++) {
    if (contourPoints[i] == basePoints) continue;
    const hole = drawContour(contourPoints[i].points);
    base = base.cut(hole);
  }
  return base.sketchOnPlane("XY").extrude(height);
};

export default drawShadow;
