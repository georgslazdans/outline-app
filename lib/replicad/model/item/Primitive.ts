import ItemType from "../ItemType";
import PrimitiveParams, {
  defaultParamsFor,
} from "./PrimitiveParams";
import BooleanOperation from "../BooleanOperation";
import Item from "../Item";
import PrimitiveType from "./PrimitiveType";
import { v4 as randomUUID } from 'uuid';
import { zeroPoint } from "@/lib/Point3D";

type Primitive = {
  type: ItemType.Primitive;
  params: PrimitiveParams;
};

export const primitiveOf = (type: PrimitiveType): Item & Primitive => {
  return {
    id: randomUUID(),
    type: ItemType.Primitive,
    name: "Primitive",
    params: defaultParamsFor(type),
    translation: zeroPoint(),
    rotation: zeroPoint(),
    booleanOperation: BooleanOperation.CUT,
  };
};

export default Primitive;
