import Item from "../../Item";
import { gridfinityHeightOf } from "../../item/Gridfinity";
import ModelData from "../../ModelData";
import findById from "../../queries/FindById";
import findParentGroupId from "../../queries/FindParentId";
import _alignItem from "./AlignItem";

const _alignWithGridfinity = (data: ModelData) => {
  const getParentHeight = (id: string): number => {
    const parentId = findParentGroupId(data, id);
    if (parentId) {
      const parent = findById(data, parentId);
      const parentHeight = parent?.translation?.z ? parent?.translation?.z : 0;
      return parentHeight + getParentHeight(parentId);
    } else {
      return 0;
    }
  };

  return (item: Item) => {
    const gridfinityHeight = gridfinityHeightOf(data);
    const parentHeight = getParentHeight(item.id);
    return _alignItem(item, gridfinityHeight - parentHeight);
  };
};

export default _alignWithGridfinity;
