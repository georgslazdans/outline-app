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

export const hasImageData = (stepResult: StepResult) => {
  const isImageEmpty = (image: ImageData) =>
    image.height === 1 && image.width === 1;
  return stepResult.imageData && !isImageEmpty(stepResult.imageData);
};

export default StepResult;
