import { makeSphere, sketchCircle, sketchRectangle } from "replicad";
import PrimitiveParams, {
  BoxParams,
  CylinderParams,
  SphereParams,
} from "../PrimitiveParams";
import PrimitiveType from "../PrimitiveType";
import ReplicadModelData from "./ReplicadModelData";

export const drawBox = (params: BoxParams): ReplicadModelData => {
  return sketchRectangle(params.width, params.length).extrude(params.height);
};

export const drawCylinder = (params: CylinderParams): ReplicadModelData => {
  return sketchCircle(params.radius).extrude(params.height);
};

export const drawSphere = (params: SphereParams): ReplicadModelData => {
  return makeSphere(params.radius);
};

export const drawPrimitive = (
  params: PrimitiveParams
): ReplicadModelData => {
  switch (params.type) {
    case PrimitiveType.BOX:
      return drawBox(params);
    case PrimitiveType.CYLINDER:
      return drawCylinder(params);
    case PrimitiveType.SPHERE:
      return drawSphere(params);
  }
};
