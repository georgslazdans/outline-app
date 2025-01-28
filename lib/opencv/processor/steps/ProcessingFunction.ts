import * as cv from "@techstark/opencv-js";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import StepSetting, { StepSettingConfig } from "./StepSettings";
import Settings from "../../Settings";
import ContourPoints, { ContourOutline } from "@/lib/data/contour/ContourPoints";

export type ProcessFunctionSuccess = {
  image: cv.Mat;
  contours?: ContourOutline[];
};

type ProcessFunctionFailed = {
  errorMessage: string;
};

export type ProcessFunctionResult =
  | ProcessFunctionSuccess
  | ProcessFunctionFailed;

export type PreviousData = {
  intermediateImageOf: (stepName: StepName) => cv.Mat;
  settingsOf: (stepName: StepName) => StepSetting;
  contoursOf: (stepName: StepName) => ContourOutline[] | undefined;
};

export type Process<T extends StepSetting> = (
  image: cv.Mat,
  settings: T,
  previous: PreviousData
) => ProcessFunctionResult;

interface ProcessingStep<T extends StepSetting> {
  name: StepName;
  settings: T;
  imageColorSpace: (settings: Settings) => ColorSpace;
  process: Process<T>;
  config?: { [key: string]: StepSettingConfig };
}

export type SettingsConfig = {
  [key: string]: StepSettingConfig;
};

export default ProcessingStep;
