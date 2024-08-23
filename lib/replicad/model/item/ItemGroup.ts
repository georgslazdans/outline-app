import BooleanOperation from "../BooleanOperation";
import Item from "../Item";
import ItemType from "../ItemType";

type ItemGroup = {
  type: ItemType.Group;
  items: Item[];
};

export const itemGroupOf = (items: Item[]): Item => {
  return {
    id: crypto.randomUUID(),
    type: ItemType.Group,
    name: "Group",
    items: items,
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    booleanOperation: BooleanOperation.CUT,
  };
};

export default ItemGroup;
