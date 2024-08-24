import { reorder } from "../../utils/Arrays";
import Item from "./Item";
import Gridfinity from "./item/Gridfinity";
import ItemType from "./ItemType";
import Primitive from "./item/Primitive";
import Shadow from "./item/Shadow";
import ItemGroup from "./item/ItemGroup";

export type ModelPart = {
  type: "model";
  item: Gridfinity | Shadow | Primitive;
};

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
