import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import Settings from "../../Settings";

type BilateralFilterSettings = {
  pixelDiameter: number;
  sigmaColor: number;
  sigmaSpace: number;
  disabled: boolean;
};

const bilateralFilter: Process<BilateralFilterSettings> = (
  image: cv.Mat,
  settings: BilateralFilterSettings,
  previous: PreviousData
): ProcessResult => {
  if (settings.disabled) {
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }
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
  return { image: converted };
};

const displaySettings = (settings: Settings, currentStepName: StepName) => {
  return settings[currentStepName].disabled == false;
};

const bilateralFilterStep: ProcessingStep<BilateralFilterSettings> = {
  name: StepName.BILATERAL_FILTER,
  settings: {
    disabled: false,
    pixelDiameter: 5,
    sigmaColor: 75,
    sigmaSpace: 75,
  },
  config: {
    disabled: {
      type: "checkbox",
    },
    pixelDiameter: {
      type: "number",
      display: displaySettings,
      min: 3,
      max: 10,
    },
    sigmaColor: {
      type: "number",
      display: displaySettings,
      min: 0,
      max: 255,
    },
    sigmaSpace: {
      type: "number",
      display: displaySettings,
      min: 0,
      max: 255,
    },
  },
  imageColorSpace: () => ColorSpace.RGBA,
  process: bilateralFilter,
};

export default bilateralFilterStep;
