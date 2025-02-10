import Item from "../../Item";
import { defaultPrimitiveHeightOf } from "../../item/PrimitiveParams";
import ItemType from "../../ItemType";

const _alignItem = (item: Item, offset: number): Item => {
  if (item.type == ItemType.Group) {
    return {
      ...item,
      translation: { ...item.translation!, z: offset },
      items: item.items.map((it) => _alignItem(it, 0)),
    };
  } else {
    let height =
      item.type == ItemType.Primitive
        ? offset + defaultPrimitiveHeightOf(item.params)
        : offset;
    return {
      ...item,
      translation: { ...item.translation!, z: height },
    };
  }
};
export default _alignItem;
