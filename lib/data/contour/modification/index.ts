import ContourPoints from "../ContourPoints";
import _centerOnOrigin from "./CenterOnOrigin";
import _centerPoints from "./CenterPoints";
import { _crudApi, _crudListOnlyApi, _crudSingleOnlyApi } from "./crud";
import _flipYPoints from "./MirrorPointsOnXAxis";
import _scaleAlongNormal from "./ScaleAlongNormal";
import _scaleAlongNormalList from "./ScaleAlongNormalList";
import _scalePoints from "./ScalePoints";

type ModificationFunction = (
  contour: ContourPoints
) => (...args: any[]) => ContourPoints;

const modificationApi = () => {
  return {
    centerOnOrigin: _centerOnOrigin,
    centerPoints: _centerPoints,
    flipYPoints: _flipYPoints,
    scalePoints: _scalePoints,
    ..._crudApi(),
  };
};

const singleOnlyApi = () => {
  return {
    scaleAlongNormal: _scaleAlongNormal,
    ..._crudSingleOnlyApi(),
  };
};

const listOnlyApi = () => {
  return {
    scaleAlongNormal: _scaleAlongNormalList,
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
