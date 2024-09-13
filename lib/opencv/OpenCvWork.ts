import { Context } from "@/context/DetailsContext";
import StepResult from "./StepResult";
import Settings, { settingsOf } from "./Settings";
import { ProcessStep } from "./processor/ProcessStep";
import { ProcessAll } from "./processor/ProcessAll";
import StepName from "./processor/steps/StepName";
import Steps from "./processor/Steps";

export const allWorkOf = (context: Context): ProcessAll => {
  const imageData =
    context.imageData ||
    (typeof window !== "undefined" ? new ImageData(1, 1) : null);

  return {
    imageData: imageData,
    settings: settingsOf(context),
  };
};

export const stepWorkOf = (
  stepResults: StepResult[],
  stepName: string,
  settings: Settings
): ProcessStep => {
  const step = previousStepWithImageOf(stepResults, stepName);
  return {
    stepName: stepName as StepName,
    imageData: step.imageData,
    imageColorSpace: step.imageColorSpace,
    settings: settings,
    previousData: filterMandatorySteps(stepResults, stepName, settings),
  };
};

const indexOfStep = (allSteps: StepResult[], stepName: string): number => {
  let index = 0;
  for (const step of allSteps) {
    if (step.stepName == stepName) {
      break;
    }
    index += 1;
  }
  if (index >= allSteps.length) {
    throw new Error("Index not found for step: " + stepName);
  }
  return index;
};

const previousStepWithImageOf = (allSteps: StepResult[], stepName: string) => {
  const stepIndex = indexOfStep(allSteps, stepName);
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

const hasImageData = (stepResult: StepResult) => {
  const isImageEmpty = (image: ImageData) =>
    image.height === 1 && image.width === 1;
  return stepResult.imageData && !isImageEmpty(stepResult.imageData);
};

const filterMandatorySteps = (
  previousResult: StepResult[],
  stepName: string,
  settings: Settings
): StepResult[] => {
  const mandatorySteps = Steps.mandatoryStepsFor(settings);
  const stepIndex = indexOfStep(previousResult, stepName);
  const stepsUntil = previousResult
    .slice(0, stepIndex - 1)
    .filter((it) => mandatorySteps.includes(it.stepName));
  return [...stepsUntil, previousResult[stepIndex - 1]];
};
