import { forModelData } from "../../ForModelData";
import Item from "../../Item";
import ItemGroup from "../../item/ItemGroup";
import ModelData from "../../ModelData";
import addItem from "./AddItem";
import _alignItem from "./AlignItem";
import _alignWithGridfinity from "./AlignWithGridfinity";
import duplicateItemFor from "./DuplicateItem";
import deleteById from "./RemoveById";
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
    deleteById: (id: string): ModelData => {
      return {
        ...data,
        items: deleteById(id, data.items),
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
    duplicateItem: duplicateItemFor(data),
    alignItem: (item: Item, offset: number): ModelData => {
      return {
        ...data,
        items: updateItem(_alignItem(item, offset), data.items),
      };
    },
    alignWithGridfinity: (item: Item): ModelData => {
      return {
        ...data,
        items: updateItem(_alignWithGridfinity(data)(item), data.items),
      };
    },
  };
};

export default itemModificationsFor;
