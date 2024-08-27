import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";
import ContourPoints from "../data/point/ContourPoints";

export type StepResult = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  contours?: ContourPoints[];
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

export default StepResult;
