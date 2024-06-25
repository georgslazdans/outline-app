import Point from "../Point";
import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";

export type StepResult = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  points?: Point[];
  debugSteps?: StepResult[];
};

export default StepResult;
