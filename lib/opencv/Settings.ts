import { Context } from "@/context/DetailsContext";
import StepName from "./processor/steps/StepName";
import deepEqual from "../utils/Objects";
import StepSetting from "./processor/steps/StepSettings";
import Steps from "./processor/Steps";
import ThresholdType from "./processor/steps/ThresholdType";

type Settings = {
  [key: string]: StepSetting;
};

export const defaultSettings = (): Settings => {
  let settings = {};
  for (const step of Steps.getAll()) {
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
    isBilateralFiterDisabled: () => {
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
  const mergedSettings = { ...defaultSettings };

  for (const key in currentSettings) {
    if (currentSettings.hasOwnProperty(key)) {
      mergedSettings[key] = {
        ...defaultSettings[key],
        ...currentSettings[key],
      };
    }
  }

  return mergedSettings;
};

export default Settings;
