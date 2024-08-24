import { zeroPoint } from "@/lib/Point3D";
import BooleanOperation from "../BooleanOperation";
import Item from "../Item";
import ItemType from "../ItemType";

type ItemGroup = {
  type: ItemType.Group;
  items: Item[];
};

export const itemGroupOf = (items: Item[]): Item & ItemGroup => {
  return {
    id: crypto.randomUUID(),
    type: ItemType.Group,
    name: "Group",
    items: items,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
  };
};

export default ItemGroup;
