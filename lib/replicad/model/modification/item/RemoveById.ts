import Item from "../../Item";
import Gridfinity from "../../item/gridfinity/Gridfinity";
import ItemType from "../../ItemType";

const deleteById = (id: string, items: Item[]): Item[] => {
  return items
    .map((it) => {
      if (it.id == id) {
        return null;
      } else {
        if (it.type == ItemType.Group) {
          return {
            ...it,
            items: deleteById(id, it.items),
          };
        } else if ((it.type == ItemType.Gridfinity)) {
          const item = it as Gridfinity;
          return {
            ...item,
            modifications: deleteById(id, item.modifications),
          };
        } else {
          return it;
        }
      }
    })
    .filter((it) => it != null) as Item[];
};

export default deleteById;
