import { ContourPoints } from "../Point";
import GridfinityParams from "./GridfinityParams";
import Point3D from "../Point3D";

enum BooleanOperation {
  UNION,
  INTERSECTION,
}

type BooleanModifier = {
  type: BooleanOperation;
};

export type Primitive = {
  type: "primitive";
  params: any; // TODO add enum and param types
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

// TODO item will have transform/rotation and operation type. Can be nested?
export type Item = {
  id: string;
  translation?: Point3D;
  rotation?: Point3D;
} & (Gridfinity | Shadow | Primitive);

export const gridfinityItemOf = (params: GridfinityParams): Item => {
  return {
    id: crypto.randomUUID(),
    type: "gridfinity",
    params: params,
  };
};

export const shadowItemOf = (
  contourPoints: ContourPoints[],
  height: number
): Item => {
  return {
    id: crypto.randomUUID(),
    type: "shadow",
    points: contourPoints,
    height: height,
    translation: { x: 0, y: 0, z: 0 },
  };
};
