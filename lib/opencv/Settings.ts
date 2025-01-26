import { Context } from "@/context/DetailsContext";
import StepName from "./processor/steps/StepName";
import deepEqual, { deepMerge } from "../utils/Objects";
import StepSetting, { StepSettingConfig } from "./processor/steps/StepSettings";
import Steps from "./processor/Steps";
import ThresholdType from "./processor/steps/ThresholdType";
import extractPaperStep from "./processor/steps/ExtractPaper";

type Settings = {
  [key: string]: StepSetting;
};

export const defaultSettings = (): Settings => {
  let settings = {};
  console.log("All steps", Steps.getAll());
  console.log("Extract paper step", extractPaperStep);
  for (const step of Steps.getAll()) {
    console.log("Processing STEP", step);
    settings = { ...settings, [step.name]: step.settings };
  }
  return settings as Settings;
};

export const settingsOf = (context: Context) => {
  return context?.settings || defaultSettings();
};

export const firstChangedStep = (
  previousSettings: Settings,
  settings: Settings
): StepName | undefined => {
  for (const step of Steps.getAll()) {
    const currentStep = settings[step.name];
    const previousStep = previousSettings[step.name];
    if (!deepEqual(currentStep, previousStep)) {
      return step.name;
    }
  }
};

export const inSettings = (settings: Settings) => {
  return {
    isBilateralFilterDisabled: () => {
      return settings[StepName.BILATERAL_FILTER].disabled;
    },
    isBlurReused: () => {
      return settings[StepName.EXTRACT_PAPER].reuseStep == StepName.BLUR;
    },
    isObjectThresholdAdaptive: () => {
      return (
        settings[StepName.OBJECT_THRESHOLD].thresholdType ==
        ThresholdType.ADAPTIVE
      );
    },
  };
};

export const applyDefaults = (
  defaultSettings: Settings,
  currentSettings: Settings
): Settings => {
  const mergedSettings: Settings = {};

  for (const step of Steps.getAll()) {
    const stepName = step.name;
    mergedSettings[stepName] = deepMerge(
      defaultSettings[stepName],
      currentSettings[stepName]
    );
  }

  return mergedSettings;
};

export default Settings;
