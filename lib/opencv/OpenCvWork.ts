import { Context } from "@/context/DetailsContext";
import Settings, { settingsOf } from "./Settings";
import { ProcessStep } from "./processor/ProcessStep";
import { ProcessAll } from "./processor/ProcessAll";
import StepName from "./processor/steps/StepName";
import StepResult, { hasImageData } from "./StepResult";

export const allWorkOf = (
  context: Context,
  contextImageData: ImageData
): ProcessAll => {
  const imageData =
    contextImageData ||
    (typeof window !== "undefined" ? new ImageData(1, 1) : null);

  return {
    imageData: imageData,
    settings: settingsOf(context),
  };
};

export const stepWorkOf = (
  stepName: string,
  settings: Settings,
  stepResults: StepResult[]
): ProcessStep => {
  const step = previousStepWithImageOf(stepResults, stepName);
  return {
    stepName: stepName as StepName,
    settings: settings,
    imageData: step.imageData,
    imageColorSpace: step.imageColorSpace,
  };
};

const previousStepWithImageOf = (allSteps: StepResult[], stepName: string) => {
  const stepIndex = indexOfStep(allSteps, stepName);
  if (stepIndex == 0) {
    return allSteps[stepIndex];
  } else {
    return getPreviousStepWithImage(allSteps, stepIndex);
  }
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
