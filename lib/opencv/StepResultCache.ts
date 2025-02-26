import Steps from "./processor/Steps";
import StepName from "./processor/steps/StepName";
import Settings, { defaultSettings } from "./Settings";
import StepResult, { hasImageData } from "./StepResult";

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
let mandatorySteps = Steps.mandatorySteps();

export const addToResultCache = (stepResult: StepResult) => {
  if (!mandatorySteps.includes(stepResult.stepName)) {
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