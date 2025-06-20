import BooleanOperation from "../../BooleanOperation";
import Item from "../../Item";
import { defaultPrimitiveHeightOf } from "../../item/PrimitiveParams";
import ItemType from "../../ItemType";

const heightOf = (item: Item): number => {
  if (item.booleanOperation == BooleanOperation.UNION) {
    if (item.type == ItemType.Contour) {
      return item.height;
    }
    if(item.type == ItemType.Text) {
      return item.height;
    }
  } else {
    if (item.type == ItemType.Primitive) {
      return defaultPrimitiveHeightOf(item.params);
    }
  }
  return 0;
};

const _alignItem = (item: Item, offset: number): Item => {
  if (item.type == ItemType.Group) {
    return {
      ...item,
      translation: { ...item.translation!, z: offset },
      items: item.items.map((it) => _alignItem(it, 0)),
    };
  } else {
    let height = heightOf(item) + offset;
    return {
      ...item,
      translation: { ...item.translation!, z: height },
    };
  }
};
export default _alignItem;
