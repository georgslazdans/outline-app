import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";

type CannySettings = {
  firstThreshold: number;
  secondThreshold: number;
};

const cannyOf: Process<CannySettings> = (
  image: cv.Mat,
  settings: CannySettings
): cv.Mat => {
  let canny = new cv.Mat();
  cv.Canny(image, canny, settings.firstThreshold, settings.secondThreshold);
  return canny;
};

const cannyFunction: ProcessingStep<CannySettings> = {
  name: "canny",
  settings: {
    firstThreshold: 100,
    secondThreshold: 200,
  },
  outputColorSpace: ColorSpace.GRAY_SCALE,
  process: cannyOf,
};

export default cannyFunction;
