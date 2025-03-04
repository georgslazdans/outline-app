import StepName from "./processor/steps/StepName";
import StepResult from "./StepResult";

enum CacheStatus {
  VALID,
  INVALID,
}

type CacheResult = {
  stepName: StepName;
  status: CacheStatus;
  result: StepResult;
};

let resultCache: CacheResult[] = [];
let cacheableSteps = [
  StepName.INPUT,
  StepName.BILATERAL_FILTER,
  StepName.BLUR,
  StepName.FIND_PAPER_OUTLINE,
  StepName.EXTRACT_PAPER,
  StepName.BLUR_OBJECT,
  StepName.OBJECT_THRESHOLD,
  StepName.FIND_PAPER_OUTLINE,
  StepName.FIND_OBJECT_OUTLINES,
];

export const addToResultCache = (stepResult: StepResult) => {
  if (!cacheableSteps.includes(stepResult.stepName)) {
    return;
  }

  const existingEntry = resultCache.find(
    (it) => it.stepName == stepResult.stepName
  );
  if (existingEntry) {
    resultCache = resultCache.map((entry) => {
      if (entry.stepName == stepResult.stepName) {
        return cacheResultOf(stepResult);
      }
      return entry;
    });
  } else {
    resultCache.push(cacheResultOf(stepResult));
  }
};

const cacheResultOf = (result: StepResult): CacheResult => {
  return {
    stepName: result.stepName,
    status: CacheStatus.VALID,
    result: result,
  };
};

export const clearCacheResults = () => {
  resultCache = [];
};

export const getCacheResults = (): StepResult[] => {
  return resultCache
    .filter((it) => it.status == CacheStatus.VALID)
    .map((it) => it.result);
};