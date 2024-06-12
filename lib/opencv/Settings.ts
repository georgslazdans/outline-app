import { Context } from "@/context/DetailsContext";
import { processingSteps } from "./ImageProcessor";
import { StepSetting } from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";
import deepEqual from "../Objects";

type Settings = {
  [key: string]: StepSetting;
  paperSettings: PaperSettings;
};

type PaperSettings = {
  width: number;
  height: number;
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

export const firstChangedStep = (previousSettings:Settings, settings: Settings): StepName | undefined => {
  for (const step of processingSteps) {
    const currentStep = settings[step.name];
    const previousStep = previousSettings[step.name];
    if(!deepEqual(currentStep, previousStep)) {
        return step.name
    }
  }
}

export default Settings;
