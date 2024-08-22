import { ContourPoints } from "../Point";
import GridfinityParams from "./GridfinityParams";
import Point3D from "../Point3D";
import PrimitiveParams, {
  defaultParamsFor,
  defaultTranslationOf,
} from "./PrimitiveParams";
import PrimitiveType from "./PrimitiveType";

export enum BooleanOperation {
  UNION,
  INTERSECTION,
}

export type Primitive = {
  type: "primitive";
  params: PrimitiveParams;
};

export type Shadow = {
  type: "shadow";
  points: ContourPoints[];
  height: number;
};

export type Gridfinity = {
  type: "gridfinity";
  params: GridfinityParams;
};

export type Item = {
  id: string;
  name: string;
  translation?: Point3D;
  rotation?: Point3D;
  booleanOperation?: BooleanOperation;
} & (Gridfinity | Shadow | Primitive);

export const gridfinityItemOf = (params: GridfinityParams): Item => {
  return {
    id: crypto.randomUUID(),
    type: "gridfinity",
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
    type: "shadow",
    name: name ? name: "Contour",
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
    type: "primitive",
    name: "Primitive",
    params: params,
    translation: defaultTranslationOf(params, gridfinityHeight),
    rotation: { x: 0, y: 0, z: 0 },
  };
};
