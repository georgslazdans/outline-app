import { forModelData } from "../ForModelData";
import Item from "../Item";
import ItemType from "../ItemType";
import ModelData from "../ModelData";
import doesItemFor from "./DoesItem";
import findById from "./FindById";
import findParentGroupId from "./FindParentId";

const queriesFor = (data: ModelData) => {
  return {
    getById: (id: string): Item => {
      const result = findById(data, id);
      if (!result) {
        throw new Error("Item not found with id: " + id);
      }
      return result;
    },
    findById: (id: string): Item | undefined => {
      return findById(data, id);
    },
    findParentId: (id: string): string | undefined => {
      return findParentGroupId(data, id);
    },
    doesItem: doesItemFor(data),
    getParentIdForObjectCreation: (selectedItem?: Item): string | undefined => {
      if (selectedItem) {
        if (selectedItem.type == ItemType.Group) return selectedItem.id;
        return forModelData(data).findParentId(selectedItem.id);
      }
    },
  };
};

export default queriesFor;
