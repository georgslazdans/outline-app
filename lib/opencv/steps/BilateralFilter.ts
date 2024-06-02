import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";

type BilateralFilterSettings = {
  pixelDiameter: number;
  sigmaColor: number;
  sigmaSpace: number;
};

const bilateralFilter: Process<BilateralFilterSettings> = (
  image: cv.Mat,
  settings: BilateralFilterSettings
): cv.Mat => {
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
  return converted;
};

const bilateralFilterFunction: ProcessingStep<BilateralFilterSettings> = {
  name: "bilateralFilter",
  settings: {
    pixelDiameter: 9,
    sigmaColor: 75,
    sigmaSpace: 75,
  },
  outputColorSpace: ColorSpace.RGBA,
  process: bilateralFilter,
};

export default bilateralFilterFunction;