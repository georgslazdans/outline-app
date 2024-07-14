import { ContourPoints } from "../Point";
import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";

export type StepResult = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  contours?: ContourPoints[];
};

export default StepResult;
