import { minMaxValues } from "../../Point";
import ContourPoints from "../ContourPoints";

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
