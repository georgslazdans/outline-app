import _divideContour from "./DivideContour";
import _isValidSplitPoint from "./IsValidSplitPoint";

export const _listOnlySplitQuery = () => {
  return {
    divideContour: _divideContour,
    isValidSplitPoint: _isValidSplitPoint,
  };
};
