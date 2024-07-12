import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import StepName from "./StepName";

type CloseContoursSettings = {
  kernelSize: number;
};

const closeContours: Process<CloseContoursSettings> = (
  image: cv.Mat,
  settings: CloseContoursSettings,
  intermediateImageOf: (stepName: StepName) => cv.Mat
): ProcessResult => {
  let closed = new cv.Mat();
  let dilated = new cv.Mat();
  let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(settings.kernelSize, settings.kernelSize));
  cv.dilate(image, dilated, kernel);

  cv.morphologyEx(dilated, closed, cv.MORPH_CLOSE, kernel);

  dilated.delete();
  return { image: closed };
};

const closeContoursStep: ProcessingStep<CloseContoursSettings> = {
  name: StepName.CLOSE_CORNERS,
  settings: {
    kernelSize: 5,
  },
  config: {
    kernelSize: {
        type: "number",
        min: 0,
        max: 50,
      },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: closeContours,
};

export default closeContoursStep;
