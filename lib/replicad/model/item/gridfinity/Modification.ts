import Point from "@/lib/data/Point";
import { v4 as randomUUID } from "uuid";
import ItemType from "../../ItemType";
import Item from "../../Item";

export type SplitCut = {
  start: Point;
  end: Point;
};

export type SplitModification = {
  id: string;
  type: ItemType.GridfinitySplit;
  cuts: SplitCut[];
};

export const emptySplitModification = (): Item & SplitModification => {
  return {
    id: randomUUID(),
    name: "Split",
    type: ItemType.GridfinitySplit,
    cuts: [],
  };
};

type Modification = SplitModification;

export default Modification;
