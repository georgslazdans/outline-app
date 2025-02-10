import { Vector3 } from "three";
import PrimitiveType from "./PrimitiveType";
import Point3D, { zeroPoint } from "@/lib/Point3D";

export type BoxParams = {
  type: PrimitiveType.BOX;
  width: number;
  height: number;
  length: number;
};

export type CylinderParams = {
  type: PrimitiveType.CYLINDER;
  radius: number;
  height: number;
};

export type SphereParams = {
  type: PrimitiveType.SPHERE;
  radius: number;
};

export type CapsuleParams = {
  type: PrimitiveType.CAPSULE;
  radius: number;
  middleHeight: number;
};

export const defaultParamsFor = (type: PrimitiveType): PrimitiveParams => {
  switch (type) {
    case PrimitiveType.BOX:
      return {
        type: PrimitiveType.BOX,
        height: 10,
        length: 10,
        width: 10,
      };
    case PrimitiveType.CYLINDER:
      return {
        type: PrimitiveType.CYLINDER,
        height: 10,
        radius: 10,
      };
    case PrimitiveType.SPHERE:
      return {
        type: PrimitiveType.SPHERE,
        radius: 5,
      };
    case PrimitiveType.CAPSULE: {
      return {
        type: PrimitiveType.CAPSULE,
        radius: 5,
        middleHeight: 10,
      };
    }
  }
};

export const defaultRotationOf = (type: PrimitiveType): Point3D => {
  if (type == PrimitiveType.CAPSULE) {
    return {
      x: 0,
      y: 90,
      z: 0,
    };
  } else {
    return zeroPoint();
  }
};

export const defaultTranslationOf = (
  params: PrimitiveParams,
  gridfinityHeight: number
): Vector3 => {
  const offset = gridfinityHeight + defaultPrimitiveHeightOf(params);
  return new Vector3(0, 0, offset);
};

export const defaultPrimitiveHeightOf = (params: PrimitiveParams): number => {
  switch (params.type) {
    case PrimitiveType.BOX:
      return -params.height;
    case PrimitiveType.CYLINDER:
      return -params.height;
    case PrimitiveType.SPHERE:
      return 0;
    case PrimitiveType.CAPSULE:
      return 0;
  }
};

type PrimitiveParams =
  | BoxParams
  | CylinderParams
  | SphereParams
  | CapsuleParams;

export default PrimitiveParams;
