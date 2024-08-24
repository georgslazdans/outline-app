import Item from "../Item";
import ItemType from "../ItemType";

const removeById = (id: string, items: Item[]): Item[] => {
    return items
      .map((it) => {
        if (it.id == id) {
          return null;
        } else {
          if (it.type == ItemType.Group) {
            return {
              ...it,
              items: removeById(id, it.items),
            };
          } else {
            return it;
          }
        }
      })
      .filter((it) => it != null);
  };

  export default removeById;