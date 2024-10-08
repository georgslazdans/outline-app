import { Vector3 } from "three";
import PrimitiveType from "./PrimitiveType";

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

export const defaultTranslationOf = (
  params: PrimitiveParams,
  gridfinityHeight: number
): Vector3 => {
  switch (params.type) {
    case PrimitiveType.BOX:
      const boxOffset = gridfinityHeight - params.height;
      return new Vector3(0, 0, boxOffset);
    case PrimitiveType.CYLINDER:
      const cylinderOffset = gridfinityHeight - params.height;
      return new Vector3(0, 0, cylinderOffset);
    case PrimitiveType.SPHERE:
      const sphereOffset = gridfinityHeight;
      return new Vector3(0, 0, sphereOffset);
    case PrimitiveType.CAPSULE:
      const capsuleOffset =
        gridfinityHeight - params.middleHeight - params.radius * 2;
      return new Vector3(0, 0, capsuleOffset);
  }
};

type PrimitiveParams =
  | BoxParams
  | CylinderParams
  | SphereParams
  | CapsuleParams;

export default PrimitiveParams;
