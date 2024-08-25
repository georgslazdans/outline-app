import { forModelData } from "../../ForModelData";
import Item from "../../Item";
import ItemGroup from "../../item/ItemGroup";
import ModelData from "../../ModelData";
import addItem from "./AddItem";
import duplicateItemFor from "./DuplicateItem";
import removeById from "./RemoveById";
import reorderItems from "./ReorderItems";
import updateItem from "./UpdateItem";

const itemModificationsFor = (data: ModelData) => {
  return {
    updateItem: (item: Item): ModelData => {
      return {
        ...data,
        items: updateItem(item, data.items),
      };
    },
    removeById: (id: string): ModelData => {
      return {
        ...data,
        items: removeById(id, data.items),
      };
    },
    addItem: (item: Item, groupId?: string): ModelData => {
      let group;
      if (groupId) {
        group = forModelData(data).findById(groupId) as Item & ItemGroup;
      }
      return {
        ...data,
        items: addItem(item, data.items, group),
      };
    },
    reorderItems: reorderItems(data),
    duplicateItem: duplicateItemFor(data)
  };
};

export default itemModificationsFor;
