import modificationsFor, { modificationsForList } from "./modification";
import Point from "../Point";
import * as cv from "@techstark/opencv-js";
import { listQueriesFor, queriesFor } from "./queries";

type ContourPoints = {
  points: Point[];
};

export const pointsFrom = (shape: cv.Mat): ContourPoints => {
  const points = [];
  for (let i = 0; i < shape.rows; i++) {
    const point = shape.row(i).data32S;
    const x = point[0];
    const y = point[1];
    points.push({ x, y });
  }
  return { points };
};

export const modifyContour = (contour: ContourPoints) => {
  return modificationsFor(contour);
};

export const modifyContourList = (contours: ContourPoints[]) => {
  return modificationsForList(contours);
};

export const queryContour = (contour: ContourPoints) => {
  return queriesFor(contour);
};

export const queryContourList = (contour: ContourPoints[]) => {
  return listQueriesFor(contour);
};

export default ContourPoints;
