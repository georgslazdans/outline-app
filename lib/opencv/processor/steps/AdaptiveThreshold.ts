import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import PreviousData from "../PreviousData";

type AdaptiveThresholdSettings = {
  maxValue: number;
  blockSize: number;
  c: number;
};

const thresholdOf: Process<AdaptiveThresholdSettings> = async (
  image: cv.Mat,
  settings: AdaptiveThresholdSettings,
  previous: PreviousData
): Promise<ProcessFunctionResult> => {
  let threshold = new cv.Mat();
  cv.adaptiveThreshold(
    image,
    threshold,
    settings.maxValue,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    settings.blockSize,
    settings.c
  );

  return { image: threshold };
};

const adaptiveThresholdStep: ProcessingStep<AdaptiveThresholdSettings> = {
  name: StepName.ADAPTIVE_THRESHOLD,
  settings: {
    maxValue: 255,
    blockSize: 7,
    c: 2,
  },
  config: {
    maxValue: {
      type: "number",
      min: 0,
      max: 255,
    },
    blockSize: {
      type: "number",
      min: 3,
      max: 50,
      step: 2,
    },
    c: {
      type: "number",
      min: -10,
      max: 10,
    },
  },
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default adaptiveThresholdStep;
