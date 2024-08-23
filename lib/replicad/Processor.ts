import { Shape3D } from "replicad";
import ItemType from "./model/ItemType";
import ModelData from "./model/ModelData";
import Item from "./model/Item";
import ReplicadModelData from "./draw/ReplicadModelData";
import { drawItem } from "./draw/Draw";
import rotateModel from "./transform/RotateModel";
import translateModel from "./transform/TranslateModel";
import processBooleanOperation from "./transform/BooleanOperation";

const modelOf = (item: Item): ReplicadModelData => {
  let model =
    item.type == ItemType.Group ? processItems(item.items) : drawItem(item);
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
  if (data.items[0].type != ItemType.Gridfinity) {
    console.warn("First item is not a gridfinity box!");
  }
  return processItems(data.items);
};
