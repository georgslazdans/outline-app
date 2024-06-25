import { Context } from "@/context/DetailsContext";
import { processingSteps } from "./processor/ImageProcessor";
import StepName from "./processor/steps/StepName";
import deepEqual from "../utils/Objects";
import Orientation from "../Orientation";
import StepSetting from "./processor/steps/StepSettings";

type Settings = {
  [key: string]: StepSetting;
};

export type PaperSettings = {
  width: number;
  height: number;
  orientation: Orientation;
};

export const defaultSettings = (): Settings => {
  let settings = {};
  for (const step of processingSteps) {
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
  for (const step of processingSteps) {
    const currentStep = settings[step.name];
    const previousStep = previousSettings[step.name];
    if (!deepEqual(currentStep, previousStep)) {
      return step.name;
    }
  }
};

export default Settings;
