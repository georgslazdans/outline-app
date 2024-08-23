import ItemType from "../ItemType";
import PrimitiveParams, { defaultParamsFor, defaultTranslationOf } from "./PrimitiveParams";
import BooleanOperation from "../BooleanOperation";
import Item from "../Item";
import PrimitiveType from "./PrimitiveType";

type Primitive = {
  type: ItemType.Primitive;
  params: PrimitiveParams;
};


export const primitiveOf = (
  type: PrimitiveType,
  gridfinityHeight: number
): Item => {
  const params = defaultParamsFor(type);
  return {
    id: crypto.randomUUID(),
    type: ItemType.Primitive,
    name: "Primitive",
    params: params,
    translation: defaultTranslationOf(params, gridfinityHeight),
    rotation: { x: 0, y: 0, z: 0 },
    booleanOperation: BooleanOperation.CUT,
  };
};


export default Primitive;
