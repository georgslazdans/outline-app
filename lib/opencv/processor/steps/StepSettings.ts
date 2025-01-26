import { Dictionary } from "@/app/dictionaries";
import SelectOption from "@/lib/utils/SelectOption";
import { ChangeEvent } from "react";
import Settings from "../../Settings";
import StepName from "./StepName";
import Steps from "../Steps";

type StepSetting = {
  [key: string]: any;
};

export type DisplaySettings = {
  tooltip?: string;
  display?: (settings: Settings, currentStepName: StepName) => boolean;
};

export type CheckboxConfig = {
  type: "checkbox";
} & DisplaySettings;

export type NumberConfig = {
  type: "number";
  min: number;
  max: number;
  step?: number;
} & DisplaySettings;

export type SelectConfig = {
  type: "select";
  optionsFunction: (dictionary: Dictionary) => SelectOption[];
} & DisplaySettings;

export type GroupConfig = {
  type: "group";
  config: { [key: string]: StepSettingConfig };
} & DisplaySettings;

export type PaperOutlineSelectConfig = {
  type: "paperOutlineSelect";
} & DisplaySettings;

export type StepSettingConfig =
  | NumberConfig
  | CheckboxConfig
  | GroupConfig
  | SelectConfig
  | PaperOutlineSelectConfig;

export const eventFieldConverterFor = (
  config: StepSettingConfig
): ((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => {
  switch (config.type) {
    case "number":
      return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        Number.parseFloat(event.target.value);
    case "group":
      return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        event.target.value;
    case "checkbox":
      return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const e = event as ChangeEvent<HTMLInputElement>;
        return e.target.checked;
      };
    case "select":
      return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        event.target.value;
    case "paperOutlineSelect":
      return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        Number.parseInt(event.target.value);
  }
};

export const configOf = (
  stepName: StepName,
  key: string
): StepSettingConfig => {
  const config = Steps.getAll().find((it) => it.name == stepName)?.config;
  if (!config) {
    throw new Error(`Config not found for key: ${key} with step: ${stepName}}`);
  }
  return config[key];
};

export default StepSetting;
