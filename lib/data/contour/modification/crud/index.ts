import addPointContourIndex from "./AddPointContourIndex";
import addPoint from "./AddPoint";
import deleteContourPoint from "./DeleteContourIndex";
import deletePoint from "./DeletePoint";
import deleteByPointIndexes from "./DeleteByPointIndexes";

export const crudSingleOnlyApi = () => {
  return {
    addPoint: addPoint,
    deletePoint: deletePoint,
    deleteByPointIndexes: deleteByPointIndexes,
  };
};

export const crudListOnlyApi = () => {
  return {
    deleteContourPoint: deleteContourPoint,
    addPoint: addPointContourIndex
  };
};
