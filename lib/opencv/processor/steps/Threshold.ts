import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import adaptiveThresholdStep from "./AdaptiveThreshold";
import binaryThresholdStep from "./BinaryThreshold";
import Settings from "../../Settings";
import ThresholdType, { thresholdOptionsFor } from "./ThresholdType";
import PreviousData from "../PreviousData";

type BinaryThresholdSettings = typeof binaryThresholdStep.settings;
type AdaptiveThresholdSettings = typeof adaptiveThresholdStep.settings;

type ThresholdSettings = {
  thresholdType: ThresholdType;
  binarySettings: BinaryThresholdSettings;
  adaptiveSettings: AdaptiveThresholdSettings;
};

const thresholdOf: Process<ThresholdSettings> = (
  image: cv.Mat,
  settings: ThresholdSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  if (settings.thresholdType == ThresholdType.ADAPTIVE) {
    return adaptiveThresholdStep.process(
      image,
      settings.adaptiveSettings,
      previous
    );
  } else {
    return binaryThresholdStep.process(
      image,
      settings.binarySettings,
      previous
    );
  }
};

const displaySettings = (thresholdType: ThresholdType) => {
  return (settings: Settings, currentStepName: StepName): boolean => {
    return settings[currentStepName]?.thresholdType == thresholdType;
  };
};

const thresholdStep: ProcessingStep<ThresholdSettings> = {
  name: StepName.THRESHOLD,
  settings: {
    thresholdType: ThresholdType.ADAPTIVE,
    binarySettings: binaryThresholdStep.settings,
    adaptiveSettings: adaptiveThresholdStep.settings,
  },
  config: {
    thresholdType: {
      type: "select",
      optionsFunction: thresholdOptionsFor,
    },
    binarySettings: {
      type: "group",
      display: displaySettings(ThresholdType.BINARY),
      config: binaryThresholdStep.config!,
    },
    adaptiveSettings: {
      type: "group",
      display: displaySettings(ThresholdType.ADAPTIVE),
      config: adaptiveThresholdStep.config!,
    },
  },
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdStep;
