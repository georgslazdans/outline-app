import { ContourPoints } from "../Point";
import GridfinityParams from "./GridfinityParams";
import { Item } from "./Model";

export type ModelPart = {
  type: "model";
  item: Item;
};

export type ModelData = {
  items: Item[];
};

export type FullModel = {
  type: "full";
} & ModelData;

export type Download = {
  type: "download";
} & FullModel;

export type ReplicadWork = ModelPart | FullModel | Download;

export const modelWorkOf = (item: Item): ModelPart => {
  return {
    type: "model",
    item: item,
  };
};

export const fullWorkOf = (items: Item[]): FullModel => {
  return {
    type: "full",
    items: items,
  };
};
