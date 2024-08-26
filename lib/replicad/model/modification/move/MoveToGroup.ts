import { forModelData } from "../../ForModelData";
import Item from "../../Item";
import ModelData from "../../ModelData";

const moveToGroup = (modelData: ModelData) => {
  return (item: Item, group: Item) => {
    return forModelData(modelData)
      .useChaining()
      .deleteById(item.id)
      .addItem(item, group.id)
      .getData();
  };
};

export default moveToGroup;
