import * as cv from "@techstark/opencv-js";
import { ContourOutline } from "@/lib/data/contour/ContourPoints";
import Settings, { inSettings } from "../Settings";
import StepResult from "../StepResult";
import { IntermediateImages } from "./ImageProcessor";
import StepName from "./steps/StepName";
import StepSetting from "./steps/StepSettings";

type PreviousData = {
  intermediateImageOf: (stepName: StepName) => cv.Mat;
  settingsOf: (stepName: StepName) => StepSetting;
  contoursOf: (stepName: StepName) => ContourOutline[] | undefined;
};

export const previousDataOf = (
  intermediateImages: IntermediateImages,
  settings: Settings,
  stepData: StepResult[]
): PreviousData => {
  const handleImageSettingsFor = (stepName: StepName): StepName => {
    if (
      stepName == StepName.BLUR_OBJECT &&
      inSettings(settings).isBlurReused()
    ) {
      stepName = StepName.EXTRACT_PAPER;
    }
    if (
      stepName == StepName.BILATERAL_FILTER &&
      inSettings(settings).isBilateralFilterDisabled()
    ) {
      stepName = StepName.INPUT;
    }
    return stepName;
  };
  const intermediateImageOf = (stepName: StepName) => {
    stepName = handleImageSettingsFor(stepName);
    return Object.entries(intermediateImages).findLast(
      ([key]) => key === stepName
    )![1];
  };
  const settingsOf = (stepName: StepName): StepSetting => {
    return settings[stepName];
  };

  const contoursOf = (stepName: StepName): ContourOutline[] | undefined => {
    return stepData.find((it) => it.stepName == stepName)?.contours;
  };

  return {
    intermediateImageOf: intermediateImageOf,
    settingsOf: settingsOf,
    contoursOf: contoursOf,
  };
};

export default PreviousData;
