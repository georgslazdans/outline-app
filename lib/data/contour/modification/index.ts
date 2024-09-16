import ContourPoints from "../ContourPoints";
import _centerPoints from "./CenterPoints";
import { _crudListOnlyApi, _crudSingleOnlyApi } from "./crud";
import _mirrorPointsOnXAxis from "./MirrorPointsOnXAxis";
import _scaleAlongNormal from "./ScaleAlongNormal";
import _scalePoints from "./ScalePoints";

type ModificationFunction = (
  contour: ContourPoints
) => (...args: any[]) => ContourPoints;

const modificationApi = () => {
  return {
    centerPoints: _centerPoints,
    mirrorPointsOnXAxis: _mirrorPointsOnXAxis,
    scaleAlongNormal: _scaleAlongNormal,
    scalePoints: _scalePoints,
  };
};

const singleOnlyApi = () => {
  return {
    ..._crudSingleOnlyApi(),
  };
};

const listOnlyApi = () => {
  return {
    ..._crudListOnlyApi(),
  };
};

type ModificationAPI = {
  [K in keyof ReturnType<typeof modificationApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof modificationApi>[K]>>
  ) => ContourPoints;
};

type SingleAPI = {
  [K in keyof ReturnType<typeof singleOnlyApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof singleOnlyApi>[K]>>
  ) => ContourPoints;
};

type ModificationListAPI = {
  [K in keyof ReturnType<typeof modificationApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof modificationApi>[K]>>
  ) => ContourPoints[];
};

type ListAPI = {
  [K in keyof ReturnType<typeof listOnlyApi>]: (
    ...args: Parameters<ReturnType<ReturnType<typeof listOnlyApi>[K]>>
  ) => ContourPoints[];
};

const modificationsFor = (
  contour: ContourPoints
): ModificationAPI & SingleAPI => {
  const apis = { ...modificationApi(), ...singleOnlyApi() };
  const entries = Object.entries(apis).map(([key, fn]) => [
    key as string,
    fn(contour),
  ]);
  return Object.fromEntries(entries);
};

export const modificationsForList = (
  contourPoints: ContourPoints[]
): ModificationListAPI & ListAPI => {
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

  const modificationApiEntries = Object.entries(modificationApi()).map(
    ([key, fn]) => [key as string, toListFunction(fn)]
  );
  const listApiEntries = Object.entries(listOnlyApi()).map(([key, fn]) => [
    key as string,
    fn(contourPoints),
  ]);
  return Object.fromEntries([...modificationApiEntries, ...listApiEntries]);
};

export default modificationsFor;
