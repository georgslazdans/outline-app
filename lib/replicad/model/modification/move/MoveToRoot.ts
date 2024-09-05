import { forModelData } from "../../ForModelData";
import Item from "../../Item";
import ModelData from "../../ModelData";

const moveToRoot = (modelData: ModelData) => {
  return (item: Item) => {
    return forModelData(modelData)
      .useChaining()
      .deleteById(item.id)
      .addItem(item)
      .getData();
  };
};

export default moveToRoot;
