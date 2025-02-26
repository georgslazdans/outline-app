import StepName from "./processor/steps/StepName";
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

export const addToResultCache = (stepResult: StepResult) => {
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

export const updateCacheResultForStep = (
  stepName: StepName
): {
  stepName: StepName;
  previousStep: StepResult;
  stepResults: StepResult[];
} => {
  invalidateStepsAfter(stepName);
  const lastValidStep = lastValidStepUntil(stepName);
  return {
    stepName: lastValidStep,
    previousStep: previousStepOf(lastValidStep),
    stepResults: validCacheResults(),
  };
};

const lastValidStepUntil = (stepName: StepName): StepName => {
  let validStepName: StepName | null = null;
  for (let i = 0; i < resultCache.length; i++) {
    const entry = resultCache[i];
    validStepName = entry.stepName;
    if (entry.stepName == stepName) {
      break;
    }
  }
  if (!validStepName) {
    throw new Error("No valid step found. Searching until: " + stepName);
  }
  return validStepName;
};

const invalidateStepsAfter = (stepName: StepName) => {
  let invalidate = false;
  for (let i = 0; i < resultCache.length; i++) {
    const entry = resultCache[i];
    if (entry.stepName == stepName) {
      invalidate = true;
    }
    if (invalidate) {
      entry.status = CacheStatus.INVALID;
    }
  }
};

const validCacheResults = (): StepResult[] => {
  return resultCache
    .filter((it) => it.status == CacheStatus.VALID)
    .map((it) => it.result);
};

const previousStepOf = (stepName: string) => {
  const allSteps = resultCache.map((it) => it.result);
  const stepIndex = indexOfStep(stepName);
  if (stepIndex == 0) {
    return allSteps[stepIndex];
  } else {
    return getPreviousStepWithImage(allSteps, stepIndex);
  }
};

const getPreviousStepWithImage = (
  allSteps: StepResult[],
  stepIndex: number
): StepResult => {
  let i = stepIndex - 1;
  let previousStep = allSteps[i];
  while (!hasImageData(previousStep)) {
    i = i - 1;
    previousStep = allSteps[i];
  }
  return previousStep;
};

const indexOfStep = (stepName: string): number => {
  let index = 0;
  for (const entry of resultCache) {
    if (entry.stepName == stepName) {
      break;
    }
    index += 1;
  }
  if (index >= resultCache.length) {
    throw new Error("Index not found for step: " + stepName);
  }
  return index;
};
