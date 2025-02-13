import ContourPoints from "../ContourPoints";
import _arePointsClockwise from "../queries/ArePointsClockwise";
import _findLargestContourOf from "../queries/FindLargestContourOf";
import _cleanIfHasIntersections from "./CleanIfHasIntersections";
import _scaleAlongNormal from "./ScaleAlongNormal";

const _scaleAlongNormalList = (contours: ContourPoints[]) => {
  return (scale: number): ContourPoints[] => {
    const { contour: base } = _findLargestContourOf(contours)();
    const scaledContours = contours.map((it) => {
      const isClockwise = _arePointsClockwise(it)();
      const scaleOfContour = () => {
        if (it == base) {
          return isClockwise ? -scale : scale;
        } else {
          return isClockwise ? scale : -scale;
        }
      };
      return _scaleAlongNormal(it)(scaleOfContour());
    });
    return scaledContours;
  };
};

export default _scaleAlongNormalList;
