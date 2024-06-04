import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";

type ThresholdSettings = {
  threshold: number;
  maxValue: number;
};

const thresholdOf: Process<ThresholdSettings> = (
  image: cv.Mat,
  settings: ThresholdSettings
): ProcessResult => {
  let threshold = new cv.Mat();
  cv.threshold(
    image,
    threshold,
    settings.threshold,
    settings.maxValue,
    cv.THRESH_BINARY
  );
  return { image: threshold };
};

const thresholdFunction: ProcessingStep<ThresholdSettings> = {
  name: StepName.THRESHOLD,
  settings: {
    threshold: 100,
    maxValue: 255,
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdFunction;
