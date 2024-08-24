import Item from "../Item";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

const findById = (data: ModelData, id: string) => {
  const findInList = (items: Item[]): Item | undefined => {
    for (const item of items) {
      if (item.id == id) {
        return item;
      }
      if (item.type == ItemType.Group) {
        const result = findInList(item.items);
        if (result) {
          return result;
        }
      }
    }
  };
  return findInList(data.items);
};

export default findById;
