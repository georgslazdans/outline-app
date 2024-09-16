import _addPointContourIndex from "./AddPointContourIndex";
import _addPoint from "./AddPoint";
import _deleteContourPoint from "./DeleteContourIndex";
import _deletePoint from "./DeletePoint";
import _deleteByPointIndexes from "./DeleteByPointIndexes";

export const _crudSingleOnlyApi = () => {
  return {
    addPoint: _addPoint,
    deletePoint: _deletePoint,
    deleteByPointIndexes: _deleteByPointIndexes,
  };
};

export const _crudListOnlyApi = () => {
  return {
    deleteContourPoint: _deleteContourPoint,
    addPoint: _addPointContourIndex
  };
};
