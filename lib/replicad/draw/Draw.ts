import Gridfinity from "../model/item/Gridfinity";
import Primitive from "../model/item/Primitive";
import Contour from "../model/item/Contour";
import ItemType from "../model/ItemType";
import gridfinityBox from "./Gridfinity";
import drawShadow from "./OutlineShadow";
import { drawPrimitive } from "./Primitives";
import ReplicadModelData from "./ReplicadModelData";

type DrawableItem = Gridfinity | Contour | Primitive;

export const drawItem = (item: DrawableItem): ReplicadModelData => {
  switch (item.type) {
    case ItemType.Gridfinity:
      return gridfinityBox(item.params);
    case ItemType.Contour:
      const { points, height } = item;
      return drawShadow(points, height);
    case ItemType.Primitive:
      return drawPrimitive(item.params);
  }
};
