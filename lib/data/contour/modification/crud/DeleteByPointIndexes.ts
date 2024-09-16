import ContourPoints, { modifyContour } from "../../ContourPoints";

const _deleteByPointIndexes = (contour: ContourPoints) => {
  return (indexesToDelete: number[]) => {
    let updatedContour = contour;
    for (let i = indexesToDelete.length - 1; i >= 0; i--) {
      updatedContour = modifyContour(updatedContour).deletePoint(
        indexesToDelete[i]
      );
    }
    return updatedContour;
  };
};

export default _deleteByPointIndexes;
