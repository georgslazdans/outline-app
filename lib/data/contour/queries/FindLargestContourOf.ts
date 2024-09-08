import { minMaxValues } from "../../Point";
import ContourPoints from "../ContourPoints";

type Result = {
  contour: ContourPoints;
  index: number;
};

const findLargestContourOf = (contourPoints: ContourPoints[]) => {
  return (): Result => {
    let result = {
      value: contourPoints[0],
      minMax: minMaxValues(contourPoints[0].points),
      index: 0,
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
          index: i,
        };
      }
    }
    return { contour: result.value, index: result.index };
  };
};

export default findLargestContourOf;
