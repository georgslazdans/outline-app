import { Gridfinity, Item, Primitive, Shadow } from "./Model";

export type ModelPart = {
  type: "model";
  item: Gridfinity | Shadow | Primitive;
};

type ModelData = {
  items: Item[];
};

export default ModelData;
