import addPointContourIndex from "./AddPointContourIndex";
import addPoint from "./AddPoint";
import deleteContourPoint from "./DeleteContourIndex";
import deletePoint from "./DeletePoint";

export const crudSingleOnlyApi = () => {
  return {
    deletePoint: deletePoint,
    addPoint: addPoint,
  };
};

export const crudListOnlyApi = () => {
  return {
    deleteContourPoint: deleteContourPoint,
    addPoint: addPointContourIndex
  };
};
