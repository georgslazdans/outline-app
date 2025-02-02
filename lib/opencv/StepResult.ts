import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";
import { ContourOutline } from "../data/contour/ContourPoints";
import Settings, { settingsOf } from "./Settings";
import Steps from "./processor/Steps";
import ProcessingStep from "./processor/steps/ProcessingFunction";
import { Context } from "@/context/DetailsContext";

export type StepResult = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  contours?: ContourOutline[];
};

export const stepResultsBefore = (
  stepName: StepName,
  stepData: StepResult[]
): StepResult[] => {
  const result: StepResult[] = [];
  for (const step of stepData) {
    if (step.stepName == stepName) {
      break;
    }
    result.push(step);
  }
  return result;
};

export const findStep = (stepName: StepName) => {
  return {
    in: (steps: StepResult[]) => {
      return steps.find((it) => it.stepName == stepName)!;
    },
  };
};

export const updateStepResultsWithNewData = (
  previousResults: StepResult[],
  newResult: StepResult[]
): StepResult[] => {
  const updatedResult = [...previousResults];
  newResult.forEach((newStep) => {
    const index = updatedResult.findIndex(
      (step) => step.stepName === newStep.stepName
    );
    if (index !== -1) {
      updatedResult[index] = newStep;
    } else {
      updatedResult.push(newStep);
    }
  });
  return updatedResult;
};

export const filterPreviousSteps = (
  list: StepResult[],
  previousSteps: StepResult[]
): StepResult[] => {
  const previousStepNames = previousSteps.map((it) => it.stepName);
  return list.filter((it) => !previousStepNames.includes(it.stepName));
};

export const placeholderSteps = (
  context: Context
): StepResult[] => {
  const settings = settingsOf(context);
  const allSteps = Steps.getAll();
  const result = [];
  for (let i = 0; i < allSteps.length; i++) {
    result.push(emptyStepResultFor(allSteps[i], settings));
  }
  return result;
};

const emptyStepResultFor = (step: ProcessingStep<any>, settings: Settings) => {
  return {
    stepName: step.name,
    imageData: new ImageData(1, 1),
    imageColorSpace: step.imageColorSpace(settings),
  };
};

export const inputStepOf = (image: ImageData): StepResult => {
  return {
    stepName: StepName.INPUT,
    imageData: image,
    imageColorSpace: ColorSpace.RGBA,
  };
};


export default StepResult;
