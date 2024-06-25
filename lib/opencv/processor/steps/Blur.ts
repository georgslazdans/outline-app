import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";

type BlurSettings = {
  blurWidth: number;
};

const blurOf: Process<BlurSettings> = (
  image: cv.Mat,
  settings: BlurSettings
): ProcessResult => {
  const blurWidth = settings.blurWidth;
  let blurred = new cv.Mat();
  cv.GaussianBlur(
    image,
    blurred,
    new cv.Size(blurWidth, blurWidth),
    0,
    0,
    cv.BORDER_DEFAULT
  );
  return { image: blurred };
};

const blurStep: ProcessingStep<BlurSettings> = {
  name: StepName.BLUR,
  settings: {
    blurWidth: 5,
  },
  config: {
    blurWidth: {
      type: "number",
      min: 0,
      max: 25,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: blurOf,
};

export default blurStep;
