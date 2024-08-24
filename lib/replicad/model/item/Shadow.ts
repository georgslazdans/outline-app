import { ContourPoints } from "@/lib/Point";
import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { zeroPoint } from "@/lib/Point3D";

type Shadow = {
  type: ItemType.Shadow;
  points: ContourPoints[];
  height: number;
};

export const shadowItemOf = (
  contourPoints: ContourPoints[],
  height: number,
  name?: string
): Item => {
  return {
    id: crypto.randomUUID(),
    type: ItemType.Shadow,
    name: name ? name : "Contour",
    points: contourPoints,
    height: height,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
  };
};

export default Shadow;
