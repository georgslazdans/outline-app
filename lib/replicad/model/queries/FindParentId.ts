import Item from "../Item";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

enum ParentSearchResult {
  FOUND,
  NOT_FOUND,
}

const findParentGroupId = (data: ModelData, id: string): string | undefined => {
  const findParentId = (items: Item[]): string | ParentSearchResult => {
    for (const item of items) {
      if (item.id == id) {
        return ParentSearchResult.FOUND;
      }
      if (item.type == ItemType.Group) {
        const result = findParentId(item.items);
        if (result == ParentSearchResult.NOT_FOUND) {
          continue;
        }
        if (result == ParentSearchResult.FOUND) {
          return item.id;
        } else {
          return result as string;
        }
      }
    }
    return ParentSearchResult.NOT_FOUND;
  };
  const parentId = findParentId(data.items);
  if (parentId && typeof parentId == "string") return parentId as string;
};

export default findParentGroupId;
