import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import adaptiveThresholdStep from "./AdaptiveThreshold";
import binaryThresholdStep from "./BinaryThreshold";
import Options from "@/lib/utils/Options";
import Settings from "../../Settings";

export enum Threshold {
  ADAPTIVE = "adaptive",
  BINARY = "binary",
}
const dictionaryPath = "threshold";

export const thresholdOptionsFor = (dictionary: any) =>
  Options.of(Threshold).withTranslation(dictionary, dictionaryPath);

type BinaryThresholdSettings = typeof binaryThresholdStep.settings;
type AdaptiveThresholdSettings = typeof adaptiveThresholdStep.settings;

type ThresholdSettings = {
  thresholdType: Threshold;
  binarySettings: BinaryThresholdSettings;
  adaptiveSettings: AdaptiveThresholdSettings;
};

const thresholdOf: Process<ThresholdSettings> = (
  image: cv.Mat,
  settings: ThresholdSettings,
  previous: PreviousData
): ProcessResult => {
  if (settings.thresholdType == Threshold.ADAPTIVE) {
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

const displaySettings = (thresholdType: Threshold) => {
  return (settings: Settings, currentStepName: StepName): boolean => {
    return settings[currentStepName]?.thresholdType == thresholdType;
  };
};

const thresholdStep: ProcessingStep<ThresholdSettings> = {
  name: StepName.THRESHOLD,
  settings: {
    thresholdType: Threshold.ADAPTIVE,
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
      display: displaySettings(Threshold.BINARY),
      config: binaryThresholdStep.config!,
    },
    adaptiveSettings: {
      type: "group",
      display: displaySettings(Threshold.ADAPTIVE),
      config: adaptiveThresholdStep.config!,
    },
  },
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: thresholdOf,
};

export default thresholdStep;
