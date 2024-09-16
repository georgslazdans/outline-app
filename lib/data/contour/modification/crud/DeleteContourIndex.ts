import ContourIndex from "../../ContourIndex";
import ContourPoints, { modifyContour } from "../../ContourPoints";

const _deleteContourPoint = (contour: ContourPoints[]) => {
  return (index: ContourIndex): ContourPoints[] => {
    return contour
      .map((it, contourIndex) => {
        if (contourIndex == index.contour) {
          return modifyContour(it).deletePoint(index.point);
        }
        return it;
      })
      .filter((it) => it && it.points.length > 0);
  };
};

export default _deleteContourPoint;
