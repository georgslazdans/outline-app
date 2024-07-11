import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";

type ThresholdSettings = {
  threshold: number;
  inverseThreshold: number;
  maxValue: number;
};

const thresholdOf: Process<ThresholdSettings> = (
  image: cv.Mat,
  settings: ThresholdSettings,
  intermediateImageOf: (stepName: StepName) => cv.Mat
): ProcessResult => {
  let threshold = new cv.Mat();
  let inverseThreshold = new cv.Mat();

  cv.threshold(
    image,
    threshold,
    settings.threshold,
    settings.maxValue,
    cv.THRESH_BINARY
  );

  cv.threshold(
    image,
    inverseThreshold,
    settings.inverseThreshold,
    settings.maxValue,
    cv.THRESH_BINARY_INV
  );

  // Create mask from inverse threshold where black parts (value 0) are selected
  let blackPartsMask = new cv.Mat();
  cv.compare(
    inverseThreshold,
    new cv.Mat(
      inverseThreshold.rows,
      inverseThreshold.cols,
      inverseThreshold.type(),
      [0, 0, 0, 0]
    ),
    blackPartsMask,
    cv.CMP_EQ
  );

  // Extract black parts from inverse threshold using the mask
  let blackParts = new cv.Mat();
  cv.bitwise_and(inverseThreshold, blackPartsMask, blackParts);

  let combined = new cv.Mat();
  cv.bitwise_xor(threshold, inverseThreshold, combined);

  threshold.delete();
  inverseThreshold.delete();
  blackPartsMask.delete();
  blackParts.delete();

  return { image: combined };
};

const thresholdStep: ProcessingStep<ThresholdSettings> = {
  name: StepName.THRESHOLD,
  settings: {
    threshold: 130,
    inverseThreshold: 255,
    maxValue: 255,
  },
  config: {
    threshold: {
      type: "number",
      min: 0,
      max: 255,
    },
    inverseThreshold: {
      type: "number",
      min: 0,
      max: 255,
    },
    maxValue: {
      type: "number",
      min: 0,
      max: 255,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdStep;
