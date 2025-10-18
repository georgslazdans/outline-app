import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import Settings from "../../Settings";
import PreviousData from "../PreviousData";

type BilateralFilterSettings = {
  pixelDiameter: number;
  sigmaColor: number;
  sigmaSpace: number;
  disabledBilateralFilter: boolean;
};

const bilateralFilter: Process<BilateralFilterSettings> = async (
  image: cv.Mat,
  settings: BilateralFilterSettings,
  previous: PreviousData
): Promise<ProcessFunctionResult> => {
  if (settings.disabledBilateralFilter) {
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
  return settings[currentStepName].disabledBilateralFilter == false;
};

const bilateralFilterStep: ProcessingStep<BilateralFilterSettings> = {
  name: StepName.BILATERAL_FILTER,
  settings: {
    disabledBilateralFilter: false,
    pixelDiameter: 9,
    sigmaColor: 75,
    sigmaSpace: 75,
  },
  config: {
    disabledBilateralFilter: {
      type: "checkbox",
    },
    pixelDiameter: {
      type: "number",
      display: displaySettings,
      min: 3,
      max: 50,
      tooltip:
        "Warning: High values are slow, but greatly help with noisy pictures. This step is reused for object outline.",
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
