import ItemType from "../ItemType";
import Item from "../Item";
import BooleanOperation from "../BooleanOperation";
import { v4 as randomUUID } from "uuid";
import { zeroPoint } from "@/lib/Point3D";

type TextItem = {
  type: ItemType.Text;
  text: string;
  height: number;
  fontSize: number;
};

export const textItemOf = (): Item => {
  return {
    id: randomUUID(),
    type: ItemType.Text,
    name: "Text",
    text: "Text",
    height: 1,
    fontSize: 16,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
  };
};

export default TextItem;
