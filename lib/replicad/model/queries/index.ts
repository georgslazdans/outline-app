import { forModelData } from "../ForModelData";
import Item from "../Item";
import ItemType from "../ItemType";
import ModelData from "../ModelData";
import doesItemFor from "./DoesItem";
import _findAlignedItems from "./FindAlignedItems";
import findById from "./FindById";
import findByType from "./FindByType";
import findParentGroupId from "./FindParentId";
import _parentTotalHeight from "./ParentTotalHeight";

const queriesFor = (data: ModelData) => {
  return {
    getById: (id: string): Item => {
      const result = findById(data, id);
      if (!result) {
        throw new Error("Item not found with id: " + id);
      }
      return result;
    },
    findById: (id?: string): Item | undefined => {
      return findById(data, id);
    },
    findParentId: (id: string): string | undefined => {
      return findParentGroupId(data, id);
    },
    findByType: (type: ItemType): Item[] => {
      return findByType(data, type);
    },
    doesItem: doesItemFor(data),
    getParentIdForObjectCreation: (selectedItem?: Item): string | undefined => {
      if (selectedItem) {
        if (selectedItem.type == ItemType.Group) return selectedItem.id;
        return forModelData(data).findParentId(selectedItem.id);
      }
    },
    findAlignedItems: _findAlignedItems(data),
    parentTotalHeight: _parentTotalHeight(data),
  };
};

export default queriesFor;
