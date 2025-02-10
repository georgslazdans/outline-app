import Item from "../Item";
import { defaultPrimitiveHeightOf } from "../item/PrimitiveParams";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

const _findAlignedItems = (data: ModelData) => {
  return (height: number) => {
    const itemHeightOf = (item: Item): number => {
      const itemHeight = item.translation?.z ? item.translation?.z : 0;
      if (item.type == ItemType.Primitive) {
        return itemHeight - defaultPrimitiveHeightOf(item.params);
      } else {
        return itemHeight;
      }
    };

    const areAligned = (items: Item[], offset: number) => {
      const result: string[] = [];
      items.forEach((item) => {
        const itemHeight = itemHeightOf(item);
        if (itemHeight + offset == height) {
          result.push(item.id);
        } else if (item.type == ItemType.Group) {
          const alignedGroupItems = areAligned(item.items, itemHeight);
          alignedGroupItems.forEach((it) => result.push(it));
        }
      });
      return result;
    };

    return areAligned(
      data.items.filter((it) => it.type != ItemType.Gridfinity),
      0
    );
  };
};

export default _findAlignedItems;
