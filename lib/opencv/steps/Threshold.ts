import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";

type ThresholdSettings = {
  threshold: number;
  maxValue: number;
};

const thresholdOf: Process<ThresholdSettings> = (
    image: cv.Mat,
    settings: ThresholdSettings
  ): cv.Mat => {
    let threshold = new cv.Mat();
    cv.threshold(image, threshold, 100, 200, cv.THRESH_BINARY);
    return threshold;
  };
  

const thresholdFunction: ProcessingStep<ThresholdSettings> = {
  name: "threshold",
  settings: {
    threshold: 100,
    maxValue: 200,
  },
  outputColorSpace: ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdFunction;