import * as cv from "@techstark/opencv-js";
import ColorSpace from "../../util/ColorSpace";
import ProcessingStep from "./ProcessingFunction";
import StepName from "./StepName";

export const INPUT: ProcessingStep<any> = {
  name: StepName.INPUT,
  settings: {
    skipPaperDetection: false
  },
  imageColorSpace: () => ColorSpace.RGBA,
  process: async (image: cv.Mat) => {
    // This step is not executed
    return { image: image };
  },
  config: {
    skipPaperDetection: {
      type: "checkbox",
    },
  }, 
};

