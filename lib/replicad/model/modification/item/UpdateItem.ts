import Item from "../../Item";
import ItemType from "../../ItemType";

const updateItem = (item: Item, items: Item[]): Item[] => {
  return items.map((it) => {
    if (it.id == item.id) {
      return item;
    } else {
      if (it.type == ItemType.Group) {
        return {
          ...it,
          items: updateItem(item, it.items),
        };
      } else {
        return it;
      }
    }
  });
};

export default updateItem;
