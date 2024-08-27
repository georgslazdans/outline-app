import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { v4 as randomUUID } from 'uuid';
import ContourPoints from "@/lib/data/point/ContourPoints";
import { zeroPoint } from "@/lib/Point3D";

type Contour = {
  type: ItemType.Contour;
  points: ContourPoints[];
  height: number;
};

export const contourItemOf = (
  contourPoints: ContourPoints[],
  height: number,
  name?: string
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
  };
};

export default Contour;
