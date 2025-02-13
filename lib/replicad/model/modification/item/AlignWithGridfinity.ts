import Item from "../../Item";
import { gridfinityHeightOf } from "../../item/gridfinity/Gridfinity";
import ModelData from "../../ModelData";
import _parentTotalHeight from "../../queries/ParentTotalHeight";
import _alignItem from "./AlignItem";

const _alignWithGridfinity = (data: ModelData) => {
  const getParentHeight = _parentTotalHeight(data)
  return (item: Item) => {
    const gridfinityHeight = gridfinityHeightOf(data);
    const parentHeight = getParentHeight(item.id);
    return _alignItem(item, gridfinityHeight - parentHeight);
  };
};

export default _alignWithGridfinity;
