import { Shape3D, Point } from "replicad";
import { eulerToAxisAngle, toDegrees } from "../utils/Math";
import ModelType, {
  ItemGroup,
  Gridfinity,
  Shadow,
  Primitive,
  BooleanOperation,
} from "./ModelType";
import gridfinityBox from "./models/Gridfinity";
import drawShadow from "./models/OutlineShadow";
import { drawPrimitive } from "./models/Primitives";
import ReplicadModelData from "./models/ReplicadModelData";
import ModelData from "./ModelData";
import Item from "./Item";

export const drawItem = (
  item: Gridfinity | Shadow | Primitive | ItemGroup
): ReplicadModelData => {
  switch (item.type) {
    case ModelType.Gridfinity:
      return gridfinityBox(item.params);
    case ModelType.Shadow:
      const { points, height } = item;
      return drawShadow(points, height);
    case ModelType.Primitive:
      return drawPrimitive(item.params);
    case ModelType.Group:
      throw new Error("Can't draw item from a group!");
  }
};

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

const translateModel = (
  model: ReplicadModelData,
  item: Item
): ReplicadModelData => {
  if (item.translation) {
    const { x, y, z } = item.translation;
    return model.translate(x, y, z);
  }
  return model;
};

const processBooleanOperation = (
  base: Shape3D,
  model: Shape3D,
  operation?: BooleanOperation
) => {
  if (operation == BooleanOperation.UNION) {
    return base.fuse(model as Shape3D);
  } else {
    return base.cut(model as Shape3D);
  }
};

const modelOf = (item: Item): ReplicadModelData => {
  let model =
    item.type == ModelType.Group ? processItems(item.items) : drawItem(item);
  model = rotateModel(model, item);
  model = translateModel(model, item);
  return model;
};

const processItems = (items: Item[]) => {
  let base = modelOf(items[0]);
  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    const model = modelOf(item);
    base = processBooleanOperation(
      base as Shape3D,
      model as Shape3D,
      item.booleanOperation
    );
  }
  return base;
};

export const processModelData = (data: ModelData): ReplicadModelData => {
  if (data.items[0].type != ModelType.Gridfinity) {
    console.warn("First item is not a gridfinity box!");
  }

  return processItems(data.items);
};
