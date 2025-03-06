import Item from "../../Item";
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
        } else if (
          (it.type == ItemType.Gridfinity || it.type == ItemType.Contour) &&
          it.modifications
        ) {
          return {
            ...it,
            modifications: deleteById(id, it.modifications),
          };
        } else {
          return it;
        }
      }
    })
    .filter((it) => it != null) as Item[];
};

export default deleteById;
