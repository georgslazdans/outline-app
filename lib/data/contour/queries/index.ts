import ContourPoints from "../ContourPoints";
import _findLineSegmentClosestToPoint from "./FindLineSegmentClosestToPoint";
import _findLargestContourOf from "./FindLargestContourOf";
import _findMiddleBetweenPoints from "./FindMiddleBetweenPoints";
import _arePointsClockwise from "./ArePointsClockwise";
import { _listOnlySplitQuery } from "./split";

const singleOnlyQuery = () => {
  return {
    findMiddleBetweenPoints: _findMiddleBetweenPoints,
    findLineSegmentClosestToPoint: _findLineSegmentClosestToPoint,
    arePointsClockwise: _arePointsClockwise,
  };
};

const listOnlyQuery = () => {
  return {
    findLargestContourOf: _findLargestContourOf,
    ..._listOnlySplitQuery()
  };
};

type SingleAPI = {
  [K in keyof ReturnType<typeof singleOnlyQuery>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof singleOnlyQuery>[K]>>
  ) => ReturnType<ReturnType<ReturnType<typeof singleOnlyQuery>[K]>>;
};

type ListAPI = {
  [K in keyof ReturnType<typeof listOnlyQuery>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof listOnlyQuery>[K]>>
  ) => ReturnType<ReturnType<ReturnType<typeof listOnlyQuery>[K]>>;
};

export const queriesFor = (contourPart: ContourPoints): SingleAPI => {
  const entries = Object.entries(singleOnlyQuery()).map(([key, fn]) => [
    key as string,
    fn(contourPart),
  ]);
  return Object.fromEntries(entries);
};

export const listQueriesFor = (contour: ContourPoints[]): ListAPI => {
  const entries = Object.entries(listOnlyQuery()).map(([key, fn]) => [
    key as string,
    fn(contour),
  ]);
  return Object.fromEntries(entries);
};
