import { ContourPoints } from "@/lib/Point";
import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";

type Shadow = {
  type: ItemType.Shadow;
  points: ContourPoints[];
  height: number;
};

export const shadowItemOf = (
  contourPoints: ContourPoints[],
  height: number,
  translationZ?: number,
  name?: string
): Item => {
  return {
    id: crypto.randomUUID(),
    type: ItemType.Shadow,
    name: name ? name : "Contour",
    points: contourPoints,
    height: height,
    translation: { x: 0, y: 0, z: translationZ ? translationZ : 0 },
    rotation: { x: 0, y: 0, z: 0 },
    booleanOperation: BooleanOperation.CUT,
  };
};

export default Shadow;
