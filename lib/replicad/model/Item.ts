import Point3D from "../../Point3D";
import BooleanOperation from "./BooleanOperation";
import Gridfinity from "./item/Gridfinity";
import ItemGroup from "./item/ItemGroup";
import Primitive from "./item/Primitive";
import Contour from "./item/Contour";

type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Contour | Primitive | ItemGroup);


export const withoutItemData = (
  item: Item
): Gridfinity | Primitive | Contour | ItemGroup => {
  const { id, translation, rotation, booleanOperation, ...rest } = item;
  return rest;
};

export default Item;
