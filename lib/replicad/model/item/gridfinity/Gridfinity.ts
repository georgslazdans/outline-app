import ModelData from "../../ModelData";
import ItemType from "../../ItemType";
import GridfinityParams from "./GridfinityParams";
import Item from "../../Item";
import { v4 as randomUUID } from "uuid";
import Modification from "./Modification";

const HEIGHT_UNIT = 7;

type Gridfinity = {
  type: ItemType.Gridfinity;
  params: GridfinityParams;
  modifications: (Item & Modification)[];
};

export const gridfinityItemOf = (params: GridfinityParams): Item => {
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
  return convertGridfinityHeightUnits(item.params.height);
};

export const convertGridfinityHeightUnits = (gridfinityHeightUnit: number) => {
  return gridfinityHeightUnit * HEIGHT_UNIT;
};

export default Gridfinity;
