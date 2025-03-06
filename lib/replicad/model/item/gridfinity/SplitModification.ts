import { v4 as randomUUID } from "uuid";
import ItemType from "../../ItemType";
import SplitCut from "./SplitCut";
import { ItemModification } from "../Modification";

export type SplitModification = {
  type: ItemType.GridfinitySplit;
  cuts: SplitCut[];
};

export const emptySplitModification = (): ItemModification => {
  return {
    id: randomUUID(),
    name: "Split",
    type: ItemType.GridfinitySplit,
    cuts: [],
  };
};
