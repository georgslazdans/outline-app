import Point from "../Point";
import ContourPoints from "./ContourPoints";

type ContourIndex = {
  contour: number;
  point: number;
};

export const pointByIndex = (contour: ContourPoints[], index: ContourIndex): Point => {
  return contour[index.contour].points[index.point];
}

export default ContourIndex;
