import Point3D from "../../Point3D";
import BooleanOperation from "./BooleanOperation";
import Gridfinity from "./item/Gridfinity";
import ItemGroup from "./item/ItemGroup";
import Primitive from "./item/Primitive";
import Contour from "./item/Contour";
import TextItem from "./item/TextItem";

type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Contour | Primitive | ItemGroup | TextItem);

export const withoutItemData = (
  item: Item
): Gridfinity | Primitive | Contour | ItemGroup | TextItem => {
  const { id, translation, rotation, booleanOperation, ...rest } = item;
  return rest;
};

export const modelKeyOf = (item: Item): string =>
  JSON.stringify(withoutItemData(item));

export default Item;
