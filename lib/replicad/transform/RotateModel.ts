import { eulerToAxisAngle, toDegrees } from "@/lib/utils/Math";
import { Point } from "replicad";
import ReplicadModelData from "../draw/ReplicadModelData";
import Item from "../model/Item";

const rotateModel = (
  model: ReplicadModelData,
  item: Item
): ReplicadModelData => {
  if (item.rotation) {
    const axisRotation = eulerToAxisAngle(item.rotation);
    const axis = [
      axisRotation.axis.x,
      axisRotation.axis.y,
      axisRotation.axis.z,
    ] as Point;
    return model.rotate(toDegrees(axisRotation.angle), [0, 0, 0], axis);
  } else {
    return model;
  }
};

export default rotateModel;
