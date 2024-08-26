import ContourPoints from "../ContourPoints";
import centerPoints from "./CenterPoints";
import { crudListOnlyApi, crudSingleOnlyApi } from "./crud";
import deleteContourPoint from "./crud/DeleteContourIndex";
import deletePoint from "./crud/DeletePoint";
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

const singleOnlyApi = () => {
  return {
    ...crudSingleOnlyApi(),
  };
};

const listOnlyApi = () => {
  return {
    ...crudListOnlyApi(),
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
