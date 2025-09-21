import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";
import PreviousData from "../PreviousData";

type CloseContoursSettings = {
  kernelSize: number;
  iterations: number;
};

const closeContours: Process<CloseContoursSettings> = async (
  image: cv.Mat,
  settings: CloseContoursSettings,
  previous: PreviousData
): Promise<ProcessFunctionResult> => {
  const closed = new cv.Mat();

  const kernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(settings.kernelSize, settings.kernelSize)
  );

  cv.morphologyEx(
    image,
    closed,
    cv.MORPH_CLOSE,
    kernel,
    new cv.Point(-1, -1),
    settings.iterations
  );

  return { image: closed };
};

const closeContoursStep: ProcessingStep<CloseContoursSettings> = {
  name: StepName.CLOSE_CORNERS,
  settings: {
    kernelSize: 15,
    iterations: 1,
  },
  config: {
    kernelSize: {
      type: "number",
      min: 1,
      max: 50,
    },
    iterations: {
      type: "number",
      min: 0,
      max: 10,
    },
  },
  imageColorSpace: () => ColorSpace.GRAY_SCALE,
  process: closeContours,
};

export default closeContoursStep;
