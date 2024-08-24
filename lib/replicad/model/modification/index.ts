import { reorder } from "@/lib/utils/Arrays";
import { forModelData } from "../ForModelData";
import Item from "../Item";
import ItemGroup from "../item/ItemGroup";
import ItemType from "../ItemType";
import ModelData from "../ModelData";
import addItem from "./AddItem";
import removeById from "./RemoveById";
import updateItem from "./UpdateItem";

const modificationsFor = (data: ModelData) => {
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
    reorderData: (sourceIndex: number, endIndex: number, groupId?: string) => {
      if (groupId) {
        const groupItem = forModelData(data).getById(groupId);
        if (!groupItem || groupItem.type != ItemType.Group) {
          throw new Error("Group not found with Id: " + groupId);
        }
        const reorderedItems = reorder(groupItem.items, sourceIndex, endIndex);
        return forModelData(data).updateItem({
          ...groupItem,
          items: reorderedItems,
        });
      } else {
        return {
          ...data,
          items: reorder(data.items, sourceIndex, endIndex),
        };
      }
    },
  };
};

export default modificationsFor;
