import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import StepName from "./StepName";

type BilateralFilterSettings = {
  pixelDiameter: number;
  sigmaColor: number;
  sigmaSpace: number;
};

const bilateralFilter: Process<BilateralFilterSettings> = (
  image: cv.Mat,
  settings: BilateralFilterSettings
): ProcessResult => {
  let converted = new cv.Mat();
  let filtered = new cv.Mat();
  cv.cvtColor(image, converted, cv.COLOR_RGBA2RGB, 0);

  cv.bilateralFilter(
    converted,
    filtered,
    settings.pixelDiameter,
    settings.sigmaColor,
    settings.sigmaSpace,
    cv.BORDER_DEFAULT
  );

  cv.cvtColor(filtered, converted, cv.COLOR_RGB2RGBA, 0);
  filtered.delete();
  return {image: converted};
};

const bilateralFilterStep: ProcessingStep<BilateralFilterSettings> = {
  name: StepName.BILETERAL_FILTER,
  settings: {
    pixelDiameter: 9,
    sigmaColor: 75,
    sigmaSpace: 75,
  },
  config: {
    pixelDiameter: {
      min:3,
      max: 10
    },
    sigmaColor: {
      min:3,
      max: 10
    },
    sigmaSpace: {
      min:3,
      max: 10
    },
  },
  imageColorSpace: ColorSpace.RGBA,
  process: bilateralFilter,
};

export default bilateralFilterStep;
