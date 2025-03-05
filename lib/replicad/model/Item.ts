import Point3D from "../../Point3D";
import BooleanOperation from "./BooleanOperation";
import Gridfinity from "./item/gridfinity/Gridfinity";
import ItemGroup from "./item/ItemGroup";
import Primitive from "./item/Primitive";
import Contour from "./item/contour/Contour";
import TextItem from "./item/TextItem";
import ItemType from "./ItemType";
import Modification from "./item/Modification";

type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Contour | Primitive | ItemGroup | TextItem | Modification);

export const withoutItemData = (
  item: Item
): Gridfinity | Primitive | Contour | ItemGroup | TextItem | Modification => {
  if (item.type == ItemType.Gridfinity) {
    const {
      id,
      translation,
      rotation,
      booleanOperation,
      modifications,
      ...rest
    } = item;
    return { ...rest, modifications: [] };
  } else if (item.type == ItemType.GridfinitySplit) {
    return item;
  } else {
    const { id, translation, rotation, booleanOperation, ...rest } = item;
    return rest;
  }
};

export const modelKeyOf = (item: Item): string =>
  JSON.stringify(withoutItemData(item));

export default Item;
