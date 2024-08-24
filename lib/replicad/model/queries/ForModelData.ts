import { reorder } from "@/lib/utils/Arrays";
import Item from "../Item";
import ItemGroup from "../item/ItemGroup";
import ItemType from "../ItemType";
import ModelData from "../ModelData";
import findById from "./FindById";
import findParentGroupId from "./FindParentId";
import updateItem from "./UpdateItem";
import removeById from "./RemoveById";
import addItem from "./AddItem";

export const forModelData = (data: ModelData) => {
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
    updateItem: (item: Item): ModelData => {
      return {
        ...data,
        items: updateItem(item, data.items),
      };
    },
    removeById: (id: string) => {
      return {
        ...data,
        items: removeById(id, data.items),
      };
    },
    addItem: (item: Item, groupId?: string) => {
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
    doesItem: (itemId: string) => {
      return {
        haveSameParentsAs: (otherId?: string) => {
          if (otherId) {
            const parentId = forModelData(data).findParentId(itemId);
            const previousParentId = forModelData(data).findParentId(otherId);
            return parentId == previousParentId;
          }
          return false;
        },
        haveNestedSibling: (otherId?: string) => {
          const parentId = forModelData(data).findParentId(itemId);
          if (parentId) {
            if (otherId) {
              const parent = forModelData(data).getById(parentId) as ItemGroup;
              const sibling = forModelData({ items: parent.items }).findById(
                otherId
              );
              return !!sibling;
            } else {
              return false;
            }
          } else {
            // Root elements
            return true;
          }
        },
        hasChild: (otherId?: string): boolean => {
          const checkItems = (items: Item[]): boolean => {
            if (items.some((it) => it.id == otherId)) {
              return true;
            } else {
              const subGroups = items.filter((it) => it.type == ItemType.Group);
              for (const group of subGroups) {
                const result = checkItems(group.items);
                if (result) return true;
              }
            }
            return false;
          };

          const item = forModelData(data).getById(itemId);
          if (item.type == ItemType.Group) {
            return checkItems(item.items);
          } else {
            // Root elements
            return false;
          }
        },
      };
    },
    getParentIdForObjectCreation: (selectedItem?: Item): string | undefined => {
      if (selectedItem) {
        if (selectedItem.type == ItemType.Group) return selectedItem.id;
        return forModelData(data).findParentId(selectedItem.id);
      }
    },
  };
};
