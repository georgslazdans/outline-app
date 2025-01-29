import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";
import { ContourOutline } from "../data/contour/ContourPoints";

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

export default StepResult;
