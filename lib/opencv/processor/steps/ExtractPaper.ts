import * as cv from "@techstark/opencv-js";
import ProcessingStep, { PreviousData, Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import Point, { pointsFrom } from "../../../Point";
import { contoursOf, largestContourOf } from "../../util/contours/Contours";
import StepName from "./StepName";
import imageWarper from "../ImageWarper";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSettings, { paperDimensionsOf } from "../../PaperSettings";

type ExtractPaperSettings = {
  reuseBlur: boolean
  paperSettings: PaperSettings;
};

const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings,
  previous: PreviousData
): ProcessResult => {
  const { contours, hierarchy } = contoursOf(image);

  const contourIndex = largestContourOf(contours);
  if (contourIndex == null) {
    console.log("Paper contours not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }

  const smoothedContour = smoothContour(contours.get(contourIndex!));
  const cornerPoints = pointsFrom(smoothedContour);

  const previousStep = settings.reuseBlur ? StepName.BLUR : StepName.BILETERAL_FILTER; 
  const previousImage = previous.intermediateImageOf(previousStep);
  const result = warpedImageOf(cornerPoints.points, previousImage, settings.paperSettings);

  contours.delete();
  hierarchy.delete();
  smoothedContour.delete();

  return { image: result, contours: [cornerPoints] };
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
    reuseBlur: true
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
    },
    reuseBlur: {
      type: "checkbox"
    }
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractPaperFrom,
};

export default extractPaperStep;
