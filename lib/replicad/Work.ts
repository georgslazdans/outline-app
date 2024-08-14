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
} & ModelData;

export type ReplicadWork = Download | ModelPart | FullModel;

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

export const downloadWorkOf = (items: Item[]): Download => {
  return {
    type: "download",
    items: items,
  };
};
