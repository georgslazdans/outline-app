import { ContourPoints } from "@/lib/Point";
import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { zeroPoint } from "@/lib/Point3D";
import { v4 as randomUUID } from 'uuid';

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
