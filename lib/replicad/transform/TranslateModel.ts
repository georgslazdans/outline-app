import ReplicadModelData from "../draw/ReplicadModelData";
import Item from "../model/Item";

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

export default translateModel;
