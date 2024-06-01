import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";

type BlurSettings = {
  blurWidth: number;
};

const blurOf: Process<BlurSettings> = (
    image: cv.Mat,
    settings: BlurSettings
  ): cv.Mat => {
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
    return blurred;
  };

const blurFunction: ProcessingStep<BlurSettings> = {
  name: "blur",
  settings: {
    blurWidth: 5,
  },
  outputColorSpace: ColorSpace.GRAY_SCALE,
  process: blurOf,
};

export default blurFunction;