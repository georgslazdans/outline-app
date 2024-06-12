import * as cv from "@techstark/opencv-js";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";
import Point from "@/lib/Point";

export type ProcessResult = {
  image: cv.Mat,
  points?: Point[],
  debugImage?: cv.Mat
}

export type Process<T extends StepSetting> = (image: cv.Mat, settings: T) => ProcessResult;

export type StepSetting = {
  [key: string]: any;
};

interface ProcessingStep<T extends StepSetting> {
  name: StepName;
  settings: T;
  imageColorSpace: ColorSpace;
  process: Process<T>;
  config?: any;
}

export default ProcessingStep;
