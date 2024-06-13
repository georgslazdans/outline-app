import * as cv from "@techstark/opencv-js";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";
import Point from "@/lib/Point";
import { Dictionary } from "@/app/dictionaries";
import SelectOption from "@/lib/utils/SelectOption";
import { ChangeEvent } from "react";

export type ProcessResult = {
  image: cv.Mat;
  points?: Point[];
  debugImage?: cv.Mat;
};

export type Process<T extends StepSetting> = (
  image: cv.Mat,
  settings: T
) => ProcessResult;

export type StepSetting = {
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

interface ProcessingStep<T extends StepSetting> {
  name: StepName;
  settings: T;
  imageColorSpace: ColorSpace;
  process: Process<T>;
  config?: { [key: string]: StepSettingConfig };
}

export const eventFieldConverterFor = (config: StepSettingConfig) => {
  switch (config.type) {
    case "number":
      return (event: ChangeEvent<HTMLInputElement>) =>
        Number.parseInt(event.target.value);
    case "group":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.value;
    case "checkbox":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.checked;
    case "select":
      return (event: ChangeEvent<HTMLInputElement>) => event.target.value;
  }
};


export default ProcessingStep;
