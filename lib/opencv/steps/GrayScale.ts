import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";

type GrayScaleSettings = {};

const grayScaleOf: Process<GrayScaleSettings> = (
  image: cv.Mat,
  settings: GrayScaleSettings
): cv.Mat => {
  let gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
  return gray;
};

const grayScaleFunction: ProcessingStep<GrayScaleSettings> = {
  name: StepName.GRAY_SCALE,
  settings: {},
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: grayScaleOf,
};

export default grayScaleFunction;
