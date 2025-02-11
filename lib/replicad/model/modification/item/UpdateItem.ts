import Item from "../../Item";
import Modification from "../../item/gridfinity/Modification";
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
      } else if (it.type == ItemType.Gridfinity) {
        return {
          ...it,
          modifications: updateItem(item, it.modifications) as (Item &
            Modification)[],
        };
      } else {
        return it;
      }
    }
  });
};

export default updateItem;
