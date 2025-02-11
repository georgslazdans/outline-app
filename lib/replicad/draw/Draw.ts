import Gridfinity from "../model/item/gridfinity/Gridfinity";
import Primitive from "../model/item/Primitive";
import Contour from "../model/item/Contour";
import ItemType from "../model/ItemType";
import gridfinityBox from "./Gridfinity";
import drawShadow from "./OutlineShadow";
import { drawPrimitive } from "./Primitives";
import ReplicadModelData from "./ReplicadModelData";
import { drawText } from "replicad";
import TextItem from "../model/item/TextItem";

type DrawableItem = Gridfinity | Contour | Primitive | TextItem;

export const drawItem = (item: DrawableItem): ReplicadModelData => {
  switch (item.type) {
    case ItemType.Gridfinity:
      return gridfinityBox(item.params);
    case ItemType.Contour:
      const { points, height } = item;
      return drawShadow(points, height);
    case ItemType.Primitive:
      return drawPrimitive(item.params);
    case ItemType.Text:
      return drawText(item.text, {
        fontSize: item.fontSize,
      })
        .sketchOnPlane("XY")
        .extrude(item.height)
        .translateZ(-item.height);
  }
};
