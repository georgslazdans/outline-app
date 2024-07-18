import { Context } from "@/context/DetailsContext";
import StepName from "./processor/steps/StepName";
import deepEqual from "../utils/Objects";
import StepSetting from "./processor/steps/StepSettings";
import Steps from "./processor/Steps";

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

export default Settings;
