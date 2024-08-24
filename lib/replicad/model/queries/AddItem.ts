import Item from "../Item";
import ItemGroup from "../item/ItemGroup";
import updateItem from "./UpdateItem";

const addItem = (
  item: Item,
  items: Item[],
  group?: Item & ItemGroup,
): Item[] => {
  if (!group) {
    return [...items, item];
  } else {
    const updatedGroup = {
      ...group,
      items: [...group.items, item],
    };
    return updateItem(updatedGroup, items);
  }
};

export default addItem;
