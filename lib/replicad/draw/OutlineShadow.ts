import Point from "@/lib/data/Point";
import { draw, Drawing, Shape3D } from "replicad";
import ReplicadModelData from "./ReplicadModelData";
import ContourPoints, {
  modifyContourList,
  queryContourList,
} from "@/lib/data/contour/ContourPoints";
import Modification from "../model/item/Modification";
import { ShellModification } from "../model/item/contour/ShellModification";

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

const drawBaseShadow = (
  contourPoints: ContourPoints[],
  height: number
): ReplicadModelData => {
  const { findLargestContourOf } = queryContourList(contourPoints);
  let { contour: basePoints } = findLargestContourOf();
  let base = drawContour(basePoints.points);

  for (let i = 0; i < contourPoints.length; i++) {
    if (contourPoints[i] == basePoints) continue;
    const hole = drawContour(contourPoints[i].points);
    base = base.cut(hole);
  }
  return base.sketchOnPlane("XY").extrude(height).translateZ(-height);
};

const outsideShell = (
  contourPoints: ContourPoints[],
  height: number,
  shellModification: ShellModification
): ReplicadModelData => {
  const scaledPoints = modifyContourList(contourPoints).scaleAlongNormal(
    shellModification.wallThickness
  );
  return drawBaseShadow(scaledPoints, height);
};

const drawShadow = (
  contourPoints: ContourPoints[],
  height: number,
  modifications: Modification[] | undefined
): ReplicadModelData => {
  const base = drawBaseShadow(contourPoints, height);
  if (modifications && modifications.length > 0) {
    // Only shell modifications supported at the moment
    const shellModification = modifications[0] as ShellModification;
    const shell = outsideShell(
      contourPoints,
      height,
      shellModification
    ) as Shape3D;
    return shell.cut(base as Shape3D);
  } else {
    return base;
  }
};

export default drawShadow;
