import Point from "../Point";
import ColorSpace from "./ColorSpace";
import StepName from "./steps/StepName";

export type StepResult = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  points?: Point[];
  debugSteps?: StepResult[];
};

export default StepResult;
