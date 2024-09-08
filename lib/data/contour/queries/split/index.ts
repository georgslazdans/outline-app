import divideContour from "./DivideContour";
import isValidSplitPoint from "./IsValidSplitPoint";

export const listOnlySplitQuery = () => {
  return {
    divideContour: divideContour,
    isValidSplitPoint: isValidSplitPoint,
  };
};
