import { ContourPoints } from "../../Point";
import Point3D from "../../Point3D";
import GridfinityParams from "./item/GridfinityParams";
import ItemType from "./ItemType";
import {
  defaultParamsFor,
  defaultTranslationOf,
} from "./item/PrimitiveParams";
import PrimitiveType from "./item/PrimitiveType";
import BooleanOperation from "./BooleanOperation";
import Gridfinity from "./item/Gridfinity";
import ItemGroup from "./item/ItemGroup";
import Primitive from "./item/Primitive";
import Shadow from "./item/Shadow";

type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Shadow | Primitive | ItemGroup);




export const withoutItemData = (
  item: Item
): Gridfinity | Primitive | Shadow | ItemGroup => {
  const { id, translation, rotation, booleanOperation, ...rest } = item;
  return rest;
};

export default Item;
