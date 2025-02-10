import ModelData, { findById } from "../ModelData";
import findParentGroupId from "./FindParentId";

const _parentTotalHeight = (data: ModelData) => {
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

  return getParentHeight;
};

export default _parentTotalHeight;
