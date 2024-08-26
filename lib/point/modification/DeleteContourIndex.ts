import ContourIndex from "@/components/editor/mode/contour/ContourIndex";
import ContourPoints, { modifyContour } from "../ContourPoints";

const deleteContourPoint = (contour: ContourPoints[]) => {
  return (index: ContourIndex): ContourPoints[] => {
    return contour.map((it, contourIndex) => {
      if (contourIndex == index.contour) {
        return modifyContour(it).deletePoint(index.point);
      }
      return it;
    });
  };
};

export default deleteContourPoint;
