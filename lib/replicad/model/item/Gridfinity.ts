import ModelData from "../ModelData";
import ItemType from "../ItemType";
import GridfinityParams from "./GridfinityParams";
import Item from "../Item";
import { v4 as randomUUID } from "uuid";

const HEIGHT_UNIT = 7;

type Gridfinity = {
  type: ItemType.Gridfinity;
  params: GridfinityParams;
};

export const gridfinityItemOf = (params: GridfinityParams): Item => {
  return {
    id: randomUUID(),
    type: ItemType.Gridfinity,
    name: "Gridfinity",
    params: params,
  };
};

export const gridfinityHeightOf = (modelData: ModelData) => {
  const item = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Gridfinity;
  const gridfinityHeight = item.params.height;
  return gridfinityHeight * HEIGHT_UNIT;
};

export default Gridfinity;
