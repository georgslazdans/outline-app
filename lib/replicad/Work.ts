import { Gridfinity, Item, Primitive, Shadow } from "./Model";

export type ModelPart = {
  type: "model";
  item: Gridfinity | Shadow | Primitive;
};

export type ModelData = {
  items: Item[];
};
