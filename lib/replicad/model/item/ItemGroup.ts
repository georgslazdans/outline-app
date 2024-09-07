import { zeroPoint } from "@/lib/Point3D";
import BooleanOperation from "../BooleanOperation";
import Item from "../Item";
import ItemType from "../ItemType";
import { v4 as randomUUID } from "uuid";

type ItemGroup = {
  type: ItemType.Group;
  items: Item[];
};

export const itemGroupOf = (items: Item[], name?: string): Item & ItemGroup => {
  return {
    id: randomUUID(),
    type: ItemType.Group,
    name: name ? name : "Group",
    items: items,
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
  };
};

export default ItemGroup;
