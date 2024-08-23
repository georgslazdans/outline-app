import ModelData from "../ModelData";
import ItemType from "../ItemType";
import GridfinityParams from "./GridfinityParams";
import Item from "../Item";

type Gridfinity = {
  type: ItemType.Gridfinity;
  params: GridfinityParams;
};

export const gridfinityItemOf = (params: GridfinityParams): Item => {
  return {
    id: crypto.randomUUID(),
    type: ItemType.Gridfinity,
    name: "Gridfinity",
    params: params,
  };
};

export const gridfinityHeightOf = (modelData: ModelData) => {
  const magicConstant = 42;
  const item = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Gridfinity;
  const gridfinityHeight = item.params.height;
  return gridfinityHeight * magicConstant;
};

export default Gridfinity;
