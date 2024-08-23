import { ContourPoints } from "../Point";
import Point3D from "../Point3D";
import GridfinityParams from "./params/GridfinityParams";
import ModelType, {
  BooleanOperation,
  Gridfinity,
  Shadow,
  Primitive,
  ItemGroup,
} from "./ModelType";
import { defaultParamsFor, defaultTranslationOf } from "./params/PrimitiveParams";
import PrimitiveType from "./PrimitiveType";

type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Shadow | Primitive | ItemGroup);

export const gridfinityItemOf = (params: GridfinityParams): Item => {
  return {
    id: crypto.randomUUID(),
    type: ModelType.Gridfinity,
    name: "Gridfinity",
    params: params,
  };
};

export const shadowItemOf = (
  contourPoints: ContourPoints[],
  height: number,
  translationZ?: number,
  name?: string
): Item => {
  return {
    id: crypto.randomUUID(),
    type: ModelType.Shadow,
    name: name ? name : "Contour",
    points: contourPoints,
    height: height,
    translation: { x: 0, y: 0, z: translationZ ? translationZ : 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
};

export const primitiveOf = (
  type: PrimitiveType,
  gridfinityHeight: number
): Item => {
  const params = defaultParamsFor(type);
  return {
    id: crypto.randomUUID(),
    type: ModelType.Primitive,
    name: "Primitive",
    params: params,
    translation: defaultTranslationOf(params, gridfinityHeight),
    rotation: { x: 0, y: 0, z: 0 },
  };
};

export const groupOf = (items: Item[]): Item => {
  return {
    id: crypto.randomUUID(),
    type: ModelType.Group,
    name: "Group",
    items: items,
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
};

export const withoutItemData = (
  item: Item
): Gridfinity | Primitive | Shadow | ItemGroup => {
  const { id, translation, rotation, booleanOperation, ...rest } = item;
  return rest;
};

export default Item;
