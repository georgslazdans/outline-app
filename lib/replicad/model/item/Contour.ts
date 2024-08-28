import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { v4 as randomUUID } from "uuid";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { zeroPoint } from "@/lib/Point3D";

type Contour = {
  type: ItemType.Contour;
  points: ContourPoints[];
  height: number;
  detailsContextId?: number;
};

export const contourItemOf = (
  contourPoints: ContourPoints[],
  height: number,
  name?: string,
  detailsContextId?: number
): Item => {
  return {
    id: randomUUID(),
    type: ItemType.Contour,
    name: name ? name : "Contour",
    points: contourPoints,
    height: height,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
    detailsContextId: detailsContextId,
  };
};

export default Contour;
