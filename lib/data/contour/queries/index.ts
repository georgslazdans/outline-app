import ContourPoints from "../ContourPoints";
import findLineSegmentClosestToPoint from "./FindIndexClosestToPoint";
import findLargestContourOf from "./FindLargestContourOf";
import findMiddleBetweenPoints from "./FindMiddleBetweenPoints";

const singleOnlyQuery = () => {
  return {
    findMiddleBetweenPoints: findMiddleBetweenPoints,
    findLineSegmentClosestToPoint: findLineSegmentClosestToPoint,
  };
};

const listOnlyQuery = () => {
  return {
    findLargestContourOf: findLargestContourOf,
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
