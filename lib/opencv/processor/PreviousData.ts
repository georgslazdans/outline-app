import * as cv from "@techstark/opencv-js";
import { ContourOutline } from "@/lib/data/contour/ContourPoints";
import Settings, { inSettings } from "../Settings";
import StepResult, { findStep } from "../StepResult";
import StepName from "./steps/StepName";
import StepSetting from "./steps/StepSettings";
import { imageOfPng } from "../util/ImageData";

type PreviousData = {
  intermediateImageOf: (stepName: StepName) => Promise<cv.Mat>;
  settingsOf: (stepName: StepName) => StepSetting;
  contoursOf: (stepName: StepName) => ContourOutline[] | undefined;
};

export const previousDataOf = (
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
      stepName = StepName.RESIZE_IMAGE;
    }
    return stepName;
  };
  const intermediateImageOf = async (stepName: StepName) => {
    stepName = handleImageSettingsFor(stepName);
    const step = findStep(stepName).in(stepData);
    return await imageOfPng(step.pngBuffer, step.imageColorSpace)
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
