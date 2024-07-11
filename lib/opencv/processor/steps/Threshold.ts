import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";

type ThresholdSettings = {
  threshold: number;
  maxValue: number;
  blockSize: number;
  c: number;
};

const thresholdOf: Process<ThresholdSettings> = (
  image: cv.Mat,
  settings: ThresholdSettings
): ProcessResult => {
  let threshold = new cv.Mat();
  cv.adaptiveThreshold(
    image,
    threshold,
    settings.maxValue,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    settings.blockSize,// 7,11,
    settings.c
  );

  // cv.threshold(
  //   image,
  //   threshold,
  //   settings.threshold,
  //   settings.maxValue,
  //   cv.THRESH_BINARY
  // );

  cv.threshold(
    threshold,
    threshold,
    settings.threshold,
    settings.maxValue,
    cv.THRESH_BINARY + cv.THRESH_OTSU
  );
  return { image: threshold };
};

const thresholdStep: ProcessingStep<ThresholdSettings> = {
  name: StepName.THRESHOLD,
  settings: {
    threshold: 130,
    maxValue: 255,
    blockSize: 11,
    c: 2,
  },
  config: {
    threshold: {
      type: "number",
      min: 0,
      max: 255,
    },
    maxValue: {
      type: "number",
      min: 0,
      max: 255,
    },
    blockSize: {
      type: "number",
      min: 0,
      max: 50,
    },
    c: {
      type: "number",
      min: -255,
      max: 255,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdStep;
