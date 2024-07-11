import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import Point, { pointsFrom } from "../../../Point";
import { contoursOf, largestContourOf } from "../../util/Contours";
import StepName from "./StepName";
import imageWarper from "../ImageWarper";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSettings, { paperDimensionsOf } from "../../PaperSettings";

type ExtractPaperSettings = {
  paperSettings: PaperSettings;
};

export const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings,
  intermediateImageOf: (stepName: StepName) => cv.Mat
): ProcessResult => {
  const { contours, hierarchy } = contoursOf(image);

  const contourIndex = largestContourOf(contours);
  if (!contourIndex) {
    console.log("Paper contours not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }

  const smoothedContour = smoothContour(contours.get(contourIndex!));
  const cornerPoints = pointsFrom(smoothedContour);

  const blurImage = intermediateImageOf(StepName.BLUR);
  const result = warpedImageOf(cornerPoints, blurImage, settings.paperSettings);

  contours.delete();
  hierarchy.delete();
  smoothedContour.delete();

  return { image: result, points: cornerPoints };
};

const smoothContour = (contour: cv.Mat) => {
  let result = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, result, accuracy, true);
  return result;
};

const warpedImageOf = (
  cornerPoints: Point[],
  src: cv.Mat,
  paperSettings: PaperSettings
): cv.Mat => {
  return imageWarper()
    .withPaperSize(paperDimensionsOf(paperSettings))
    .andPaperContour(cornerPoints)
    .warpImage(src);
};

const extractPaperStep: ProcessingStep<ExtractPaperSettings> = {
  name: StepName.EXTRACT_PAPER,
  settings: {
    paperSettings: {
      width: 210,
      height: 297,
      orientation: Orientation.LANDSCAPE,
    },
  },
  config: {
    paperSettings: {
      type: "group",
      config: {
        width: {
          type: "number",
          min: 1,
          max: 10000,
        },
        height: {
          type: "number",
          min: 1,
          max: 10000,
        },
        orientation: {
          type: "select",
          optionsFunction: orientationOptionsFor,
        },
      },
    }
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractPaperFrom,
};

export default extractPaperStep;
