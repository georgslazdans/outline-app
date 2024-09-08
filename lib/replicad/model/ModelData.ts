import Item from "./Item";
import ItemGroup from "./item/ItemGroup";
import ItemType from "./ItemType";

type ModelData = {
  items: Item[];
};

export const ungroupedItemsOf = (groupedItems: Item[]): Item[] => {
  const ungroupedItems: Item[] = [];

  const addItems = (items: Item[]) => {
    items.forEach((item) => {
      ungroupedItems.push(item);
      if (item.type == ItemType.Group) {
        addItems(item.items);
      }
    });
  };
  addItems(groupedItems);
  return ungroupedItems;
};

export const findById = (
  modelData: ModelData,
  id?: string
): Item | undefined => {
  if (!id) return;

  const find = (items: Item[]): Item | undefined => {
    const result = items.find((it) => it.id == id);
    if (result) {
      return result;
    } else {
      const groups: (Item & ItemGroup)[] = items
        .filter((it) => it.type == ItemType.Group)
        .map((it) => it as Item & ItemGroup);
      const groupItems = groups
        .map((it) => find(it.items))
        .filter((it) => !!it);
      if (groupItems.length > 0) {
        return groupItems[0];
      }
    }
  };
  return find(modelData.items);
};

export default ModelData;
