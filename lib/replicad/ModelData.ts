import { reorder } from "../utils/Arrays";
import Item from "./Item";
import ModelType, { Gridfinity, Primitive, Shadow } from "./ModelType";

export type ModelPart = {
  type: "model";
  item: Gridfinity | Shadow | Primitive;
};

type ModelData = {
  items: Item[];
};

const findById = (data: ModelData, id: string) => {
  const findInList = (items: Item[]): Item | undefined => {
    for (const item of items) {
      if (item.id == id) {
        return item;
      }
      if (item.type == ModelType.Group) {
        const result = findInList(item.items);
        if (result) {
          return result;
        }
      }
    }
  };
  return findInList(data.items);
};

const findParentGroupId = (data: ModelData, id: string): string | undefined => {
  const findParentId = (items: Item[]): string | boolean => {
    for (const item of items) {
      if (item.id == id) {
        return true;
      }
      if (item.type == ModelType.Group) {
        const result = findParentId(item.items);
        if (result) {
          return item.id;
        }
      }
    }
    return false;
  };
  const parentId = findParentId(data.items);
  if (parentId && typeof parentId == "string") return parentId as string;
};

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
    updateById: (id: string, item: Item): ModelData => {
      const mapItems = (items: Item[]): Item[] => {
        return items.map((it) => {
          if (it.id == id) {
            return item;
          } else {
            if (it.type == ModelType.Group) {
              return {
                ...it,
                items: mapItems(it.items),
              };
            } else {
              return it;
            }
          }
        });
      };
      return {
        ...data,
        items: mapItems(data.items),
      };
    },
    removeById: (id: string) => {
      const filterItems = (items: Item[]): Item[] => {
        return items
          .map((it) => {
            if (it.id == id) {
              return null;
            } else {
              if (it.type == ModelType.Group) {
                return {
                  ...it,
                  items: filterItems(it.items),
                };
              } else {
                return it;
              }
            }
          })
          .filter((it) => it != null);
      };
      return {
        ...data,
        items: filterItems(data.items),
      };
    },
    addItem: (item: Item, groupId?: string) => {
      if (!groupId) {
        return {
          ...data,
          items: [...data.items, item],
        };
      } else {
        const groupItem = forModelData(data).getById(groupId);
        if (groupItem && groupItem.type == ModelType.Group) {
          return forModelData(data).updateById(groupId, {
            ...groupItem,
            items: [...groupItem.items, item],
          });
        } else {
          throw new Error("Group not found with Id: " + groupId);
        }
      }
    },
    reorderData: (sourceIndex: number, endIndex: number, groupId?: string) => {
      if (groupId) {
        const groupItem = forModelData(data).getById(groupId);
        if (!groupItem || groupItem.type != ModelType.Group) {
          throw new Error("Group not found with Id: " + groupId);
        }
        const reorderedItems = reorder(groupItem.items, sourceIndex, endIndex);
        return forModelData(data).updateById(groupId, {
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

export const ungroupedItemsOf = (groupedItems: Item[]): Item[] => {
  const ungroupedItems: Item[] = [];

  const addItems = (items: Item[]) => {
    items.forEach((item) => {
      ungroupedItems.push(item);
      if (item.type == ModelType.Group) {
        addItems(item.items);
      }
    });
  };
  addItems(groupedItems);
  return ungroupedItems;
};

export default ModelData;
