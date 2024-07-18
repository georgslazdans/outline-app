import * as cv from "@techstark/opencv-js";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import Point from "@/lib/Point";
import StepSetting, { StepSettingConfig } from "./StepSettings";
import Settings from "../../Settings";

export type ProcessResult = {
  image: cv.Mat;
  contours?: ContourPoints[]
};

export type ContourPoints = {
  points: Point[];
}

export type ErrorResult = {
  message: string;
};

export type PreviousData = {
  intermediateImageOf: (stepName: StepName) => cv.Mat,
  settingsOf: (stepName: StepName) => StepSetting
}

export type Process<T extends StepSetting> = (
  image: cv.Mat,
  settings: T,
  previous: PreviousData
) => ProcessResult;

interface ProcessingStep<T extends StepSetting> {
  name: StepName;
  settings: T;
  imageColorSpace: (settings: Settings) => ColorSpace;
  process: Process<T>;
  config?: { [key: string]: StepSettingConfig };
}

export default ProcessingStep;
