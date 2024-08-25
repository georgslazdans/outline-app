import { forModelData } from "../../ForModelData";
import Item from "../../Item";
import { itemGroupOf } from "../../item/ItemGroup";
import ModelData from "../../ModelData";

const moveToNewGroup = (modelData: ModelData) => {
  return (item: Item, target: Item) => {
    const parentId = forModelData(modelData).findParentId(target.id);
    const group = itemGroupOf([item, target]);
    return forModelData(modelData)
      .useChaining()
      .removeById(item.id)
      .removeById(target.id)
      .addItem(group, parentId)
      .getData();
  };
};

export default moveToNewGroup;
