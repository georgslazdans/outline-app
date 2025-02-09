import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { v4 as randomUUID } from "uuid";
import ContourPoints, {
  ContourOutline,
  contourPointsOf,
  modifyContour,
  modifyContourList,
  queryContour,
} from "@/lib/data/contour/ContourPoints";
import { zeroPoint } from "@/lib/Point3D";
import {
  centerPoints,
  Context,
  contourOutlineOf,
} from "@/context/DetailsContext";
import Point from "@/lib/data/Point";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";

type Contour = {
  type: ItemType.Contour;
  points: ContourPoints[];
  height: number;
  offset: Point;
  detailsContextId?: number;
};

const offsetOf = (contourOutline: ContourOutline, context: Context): Point => {
  const paperDimensions = paperDimensionsOfDetailsContext(context);
  const centeredPoints = modifyContour(contourOutline.outline).centerPoints(
    paperDimensions
  );
  const bounds = queryContour(centeredPoints).findPathBounds();
  return {
    x: -(bounds.maxX + bounds.minX) / 2,
    y: (bounds.maxY + bounds.minY) / 2,
  };
};

export const contourItemOf = (
  context: Context,
  contourIndex: number,
  height: number
): Item => {
  const name = context.details.name;
  const contourOutline = contourOutlineOf(context, contourIndex);
  const offset = offsetOf(contourOutline, context);
  const centeredPoints = centerPoints(context, contourPointsOf(contourOutline));
  const offsetPoints = modifyContourList(centeredPoints).offsetPoints(offset);
  return {
    id: randomUUID(),
    type: ItemType.Contour,
    name: name ? name : "Contour",
    points: offsetPoints,
    height: height,
    offset: offset,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
    detailsContextId: context.id,
  };
};

export default Contour;
