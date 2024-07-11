import * as cv from "@techstark/opencv-js";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import Point from "@/lib/Point";
import StepSetting, { StepSettingConfig } from "./StepSettings";

export type ProcessResult = {
  image: cv.Mat;
  points?: Point[];
};

export type ErrorResult = {
  message: string;
};

export type Process<T extends StepSetting> = (
  image: cv.Mat,
  settings: T,
  intermediateImageOf: (stepName: StepName) => cv.Mat
) => ProcessResult;

interface ProcessingStep<T extends StepSetting> {
  name: StepName;
  settings: T;
  imageColorSpace: ColorSpace;
  process: Process<T>;
  config?: { [key: string]: StepSettingConfig };
}

export default ProcessingStep;
