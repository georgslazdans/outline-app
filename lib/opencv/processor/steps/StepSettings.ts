import { Dictionary } from "@/app/dictionaries";
import SelectOption from "@/lib/utils/SelectOption";
import { ChangeEvent } from "react";
import Settings from "../../Settings";
import StepName from "./StepName";

type StepSetting = {
  [key: string]: any;
};

export type DisplaySettings = {
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

export type StepSettingConfig =
  | NumberConfig
  | CheckboxConfig
  | GroupConfig
  | SelectConfig;

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
  }
};

export default StepSetting;
