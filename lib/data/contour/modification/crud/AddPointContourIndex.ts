import ContourIndex from "../../ContourIndex";
import ContourPoints, { modifyContour } from "../../ContourPoints";
import Point from "../../../Point";

const addPointContourIndex = (contour: ContourPoints[]) => {
  return (index: ContourIndex, point: Point): ContourPoints[] => {
    return contour.map((it, contourIndex) => {
      if (contourIndex == index.contour) {
        return modifyContour(it).addPoint(point, index.point);
      }
      return it;
    });
  };
};

export default addPointContourIndex;
