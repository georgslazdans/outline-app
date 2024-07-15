import { Dictionary } from "@/app/dictionaries";
import SelectOption from "@/lib/utils/SelectOption";
import { ChangeEvent } from "react";

type StepSetting = {
  [key: string]: any;
};

export type CheckboxConfig = {
  type: "checkbox";
};
export type NumberConfig = {
  type: "number";
  min: number;
  max: number;
  step?: number;
};

export type SelectConfig = {
  type: "select";
  optionsFunction: (dictionary: Dictionary) => SelectOption[];
};

export type GroupConfig = {
  type: "group";
  config: { [key: string]: StepSettingConfig };
};

export type StepSettingConfig =
  | NumberConfig
  | CheckboxConfig
  | GroupConfig
  | SelectConfig;

export const eventFieldConverterFor = (config: StepSettingConfig) => {
  switch (config.type) {
    case "number":
      return (event: ChangeEvent<HTMLInputElement>) =>
        Number.parseFloat(event.target.value);
    case "group":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.value;
    case "checkbox":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.checked;
    case "select":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.value;
  }
};

export default StepSetting;
