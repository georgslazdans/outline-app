import { v4 as randomUUID } from "uuid";
import Item from "../../Item";
import ItemType from "../../ItemType";
import ModelData from "../../ModelData";
import { forModelData } from "../../ForModelData";
import { ItemModification } from "../../item/Modification";

const duplicateItemFor = (data: ModelData) => {
  const duplicateItem = (item: Item): Item => {
    if (item.type == ItemType.Group) {
      return {
        ...item,
        id: randomUUID(),
        items: item.items.map(duplicateItem),
      };
    }
    if (item.type == ItemType.Contour && item.modifications) {
      return {
        ...item,
        id: randomUUID(),
        modifications: item.modifications.map(
          duplicateItem
        ) as ItemModification[],
      };
    }
    return {
      ...item,
      id: randomUUID(),
    };
  };

  return (item: Item, onNewItem?: (item: Item) => void): ModelData => {
    const duplicate = duplicateItem(item);
    if (onNewItem) {
      onNewItem(duplicate);
    }
    const { addItem, findParentId } = forModelData(data);
    return addItem(duplicate, findParentId(item.id));
  };
};

export default duplicateItemFor;
