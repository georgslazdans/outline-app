import { reorder } from "@/lib/utils/Arrays";
import { forModelData } from "../../ForModelData";
import ItemType from "../../ItemType";
import ModelData from "../../ModelData";

const reorderItems = (data: ModelData) => {
  return (
    sourceIndex: number,
    endIndex: number,
    groupId?: string
  ): ModelData => {
    const reorderGroup = (groupId: string): ModelData => {
      const { getById, updateItem } = forModelData(data);
      const groupItem = getById(groupId);
      if (!groupItem || groupItem.type != ItemType.Group) {
        throw new Error("Group not found with Id: " + groupId);
      }
      return updateItem({
        ...groupItem,
        items: reorder(groupItem.items, sourceIndex, endIndex),
      });
    };
    
    if (groupId) {
      return reorderGroup(groupId);
    } else {
      return {
        ...data,
        items: reorder(data.items, sourceIndex, endIndex),
      };
    }
  };
};

export default reorderItems;
