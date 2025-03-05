import Item from "../Item";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

const findByType = (data: ModelData, type: ItemType): Item[] => {
  const findType = (items: Item[]): Item[] => {
    const result = [];

    for (const item of items) {
      if (item.type == type) {
        result.push(item);
      }

      if (item.type == ItemType.Group) {
        const nestedResult = findType(item.items);
        nestedResult.forEach((it) => result.push(it));
      }
      if (
        (item.type == ItemType.Gridfinity || item.type == ItemType.Contour) &&
        item.modifications
      ) {
        const nestedResult = findType(item.modifications);
        nestedResult.forEach((it) => result.push(it));
      }
    }
    return result;
  };
  return findType(data.items);
};

export default findByType;
