import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import PreviousData from "../PreviousData";

type BinaryThresholdSettings = {
  threshold: number;
  inverseThreshold: number;
  maxValue: number;
};

const binaryThresholdOf: Process<BinaryThresholdSettings> = async (
  image: cv.Mat,
  settings: BinaryThresholdSettings,
  previous: PreviousData
): Promise<ProcessFunctionResult> => {
  const threshold = new cv.Mat();
  const inverseThreshold = new cv.Mat();

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

  const blackPartsMask = new cv.Mat();
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

  const blackParts = new cv.Mat();
  cv.bitwise_and(inverseThreshold, blackPartsMask, blackParts);

  const combined = new cv.Mat();
  cv.bitwise_xor(threshold, inverseThreshold, combined);

  threshold.delete();
  inverseThreshold.delete();
  blackPartsMask.delete();
  blackParts.delete();
  return { image: combined };
};

const binaryThresholdStep: ProcessingStep<BinaryThresholdSettings> = {
  name: StepName.BINARY_THRESHOLD,
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
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: binaryThresholdOf,
};

export default binaryThresholdStep;
