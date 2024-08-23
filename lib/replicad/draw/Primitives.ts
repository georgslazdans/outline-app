import { makeSphere, sketchCircle, sketchRectangle } from "replicad";
import PrimitiveParams, {
  BoxParams,
  CylinderParams,
  SphereParams,
} from "../model/item/PrimitiveParams";
import PrimitiveType from "../model/item/PrimitiveType";
import ReplicadModelData from "./ReplicadModelData";

const drawBox = (params: BoxParams): ReplicadModelData => {
  return sketchRectangle(params.width, params.length).extrude(params.height);
};

const drawCylinder = (params: CylinderParams): ReplicadModelData => {
  return sketchCircle(params.radius).extrude(params.height);
};

const drawSphere = (params: SphereParams): ReplicadModelData => {
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
