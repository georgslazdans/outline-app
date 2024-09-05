import Item from "./Item";
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

export default ModelData;
