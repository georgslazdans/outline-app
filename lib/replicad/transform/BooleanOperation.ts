import { Shape3D } from "replicad";
import ReplicadModelData from "../draw/ReplicadModelData";
import BooleanOperation from "../model/BooleanOperation";

const processBooleanOperation = (
  base: Shape3D,
  model: Shape3D,
  operation?: BooleanOperation
): ReplicadModelData => {
  switch (operation) {
    case BooleanOperation.UNION:
      return base.fuse(model);
    case BooleanOperation.CUT:
      return base.cut(model);
    case BooleanOperation.INTERSECTION:
      return base.intersect(model);
  }
  throw new Error("Operation not supported! " + operation);
};

export default processBooleanOperation;
