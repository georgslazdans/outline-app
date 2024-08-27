import Point from "../../Point";
import ContourPoints from "../ContourPoints";

const minMaxValues = (points: Point[]) => {
  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;

  points.forEach((point) => {
    if (minX > point.x) {
      minX = point.x;
    }
    if (maxX < point.x) {
      maxX = point.x;
    }
    if (minY > point.y) {
      minY = point.y;
    }
    if (maxY < point.y) {
      maxY = point.y;
    }
  });
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
};

const findLargestContourOf = (contourPoints: ContourPoints[]) => {
  return (): ContourPoints => {
    let result = {
      value: contourPoints[0],
      minMax: minMaxValues(contourPoints[0].points),
    };
    for (let i = 1; i < contourPoints.length; i++) {
      const minMax = minMaxValues(contourPoints[i].points);
      if (
        minMax.minX < result.minMax.minX &&
        minMax.minY < result.minMax.minY &&
        minMax.maxX > result.minMax.maxX &&
        minMax.maxY > result.minMax.maxY
      ) {
        result = {
          value: contourPoints[i],
          minMax: minMax,
        };
      }
    }
    return result.value;
  };
};

export default findLargestContourOf;
