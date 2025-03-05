import { forModelData } from "../ForModelData";
import Item from "../Item";
import Contour from "../item/contour/Contour";
import Gridfinity from "../item/gridfinity/Gridfinity";
import ItemGroup from "../item/ItemGroup";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

const doesItemFor = (data: ModelData) => {
  return (itemId: string) => {
    return {
      haveSameParentsAs: (otherId?: string) => {
        if (otherId) {
          const parentId = forModelData(data).findParentId(itemId);
          const previousParentId = forModelData(data).findParentId(otherId);
          if (!parentId && !previousParentId) {
            return true; // Root elements
          }
          return parentId == previousParentId;
        }
        return false;
      },
      haveNestedSibling: (otherId?: string) => {
        const { findParentId, getById } = forModelData(data);
        const parentId = findParentId(itemId);
        if (parentId) {
          if (otherId) {
            const parent = getById(parentId) as ItemGroup;
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
            const subGroups = items.filter(
              (it) => it.type == ItemType.Group
            ) as (Item & ItemGroup)[];
            for (const group of subGroups) {
              const result = checkItems(group.items);
              if (result) return true;
            }

            const gridfinity = items.find(
              (it) => it.type == ItemType.Gridfinity
            ) as Item & Gridfinity;
            if (gridfinity && gridfinity.modifications) {
              const result = checkItems(gridfinity.modifications);
              if (result) return true;
            }

            const contours = items.filter(
              (it) => it.type == ItemType.Contour && it.modifications
            ) as (Item & Contour)[];
            const result = contours.find((it) => checkItems(it.modifications!));
            if (result) return true;
          }
          return false;
        };

        const item = forModelData(data).findById(itemId);
        if (item && item.type == ItemType.Group) {
          return checkItems(item.items);
        } else {
          // Root elements
          return false;
        }
      },
    };
  };
};

export default doesItemFor;
