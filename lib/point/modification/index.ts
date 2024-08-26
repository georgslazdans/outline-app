import ContourPoints from "../ContourPoints";
import centerPoints from "./CenterPoints";
import scaleAlongNormalNew from "./ScaleAlongNormal";
import scalePoints from "./ScalePoints";

type ModificationFunction = (
  contour: ContourPoints
) => (...args: any[]) => ContourPoints;

const modificationApi = () => {
  return {
    centerPoints: centerPoints,
    scaleAlongNormal: scaleAlongNormalNew,
    scalePoints: scalePoints,
  };
};

type ModificationAPI = {
  [K in keyof ReturnType<typeof modificationApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof modificationApi>[K]>>
  ) => ContourPoints;
};

type ModificationListAPI = {
  [K in keyof ReturnType<typeof modificationApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof modificationApi>[K]>>
  ) => ContourPoints[];
};

const modificationsFor = (contour: ContourPoints): ModificationAPI => {
  const entries = Object.entries(modificationApi()).map(([key, fn]) => [
    key as string,
    fn(contour),
  ]);
  return Object.fromEntries(entries);

  //   return {
  //     centerPoints: centerPoints(contourPoints),
  //     scaleAlongNormal: scaleAlongNormalNew(contourPoints),
  //     scalePoints: scalePoints(contourPoints),
  //   };
};

export const modificationsForList = (
  contourPoints: ContourPoints[]
): ModificationListAPI => {
  const toListFunction = (
    fn: ModificationFunction
  ): ((...args: any[]) => ContourPoints[]) => {
    return (...args: any[]) => {
      return contourPoints.map((it) => {
        const apiFunction = fn(it);
        return apiFunction(...args);
      });
    };
  };

  const entries = Object.entries(modificationApi()).map(([key, fn]) => [
    key as string,
    toListFunction(fn),
  ]);
  return Object.fromEntries(entries);
};

export default modificationsFor;
