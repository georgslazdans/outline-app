import ModelData from "../../ModelData";
import ItemType from "../../ItemType";
import GridfinityParams from "./GridfinityParams";
import Item from "../../Item";
import { v4 as randomUUID } from "uuid";
import { ItemModification } from "../Modification";

const HEIGHT_UNIT = 7;

type Gridfinity = {
  type: ItemType.Gridfinity;
  params: GridfinityParams;
  modifications?: ItemModification[];
};

export const gridfinityItemOf = (
  params: GridfinityParams
): Item & Gridfinity => {
  return {
    id: randomUUID(),
    type: ItemType.Gridfinity,
    name: "Gridfinity",
    params: params,
    modifications: [],
  };
};

export const gridfinityHeightOf = (modelData: ModelData) => {
  const item = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Gridfinity;
  if (item.params.keepFull) {
    return convertGridfinityHeightUnits(item.params.height);
  } else {
    return convertGridfinityHeightUnits(item.params.insideHeight);
  }
};

export const convertGridfinityHeightUnits = (gridfinityHeightUnit: number) => {
  return (gridfinityHeightUnit - 1) * HEIGHT_UNIT + 2;
};

export default Gridfinity;
