import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import Point, { pointsFrom } from "../../Point";
import cannyStep from "./Canny";
import { contoursOf, largestContourOf } from "../Contours";
import StepName from "./StepName";
import imageWarper from "../ImageWarper";
import { PaperSettings } from "../Settings";
import Orientation from "@/lib/Orientation";

const cannyOf = cannyStep.process;
type CannySettings = typeof cannyStep.settings;

type ExtractPaperSettings = {
  cannySettings: CannySettings;
  paperSettings: PaperSettings;
};

export const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings
): ProcessResult => {
  const canny = cannyOf(image, settings.cannySettings).image;
  const { contours, hierarchy } = contoursOf(canny);

  const contourIndex = largestContourOf(contours);
  if (!contourIndex) {
    console.log("Paper contours not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
    // return { image: drawLargestContour(image.size(), contours, hierarchy) };
  }

  const smoothedContour = smoothContour(contours.get(contourIndex!));
  const cornerPoints = pointsFrom(smoothedContour);

  const result = warpedImageOf(cornerPoints, image, settings.paperSettings);

  contours.delete();
  hierarchy.delete();
  canny.delete();
  smoothedContour.delete();

  return { image: result, points: cornerPoints };
};

const smoothContour = (contour: cv.Mat) => {
  let result = new cv.Mat();
  const accuracy = 0.02 * cv.arcLength(contour, true);
  cv.approxPolyDP(contour, result, accuracy, true);
  return result;
};

const paperWidthOf = (paperSettings: PaperSettings) => {
  return paperSettings.orientation == Orientation.PORTRAIT
    ? paperSettings.width
    : paperSettings.height;
};

const paperHeightOf = (paperSettings: PaperSettings) => {
  return paperSettings.orientation == Orientation.PORTRAIT
    ? paperSettings.height
    : paperSettings.width;
};

// TODO this needs to have a landscape vs portrait mode
const warpedImageOf = (
  cornerPoints: Point[],
  src: cv.Mat,
  paperSettings: PaperSettings
): cv.Mat => {
  const scale = 4;
  const paperWidth = paperWidthOf(paperSettings) * scale;
  const paperHeight = paperHeightOf(paperSettings) * scale;

  return imageWarper()
    .withPaperSize(paperWidth, paperHeight)
    .andPaperContour(cornerPoints)
    .warpImage(src);
};

const extractPaperStep: ProcessingStep<ExtractPaperSettings> = {
  name: StepName.EXTRACT_PAPER,
  settings: {
    cannySettings: {
      firstThreshold: 100,
      secondThreshold: 200,
    },
    paperSettings: {
      width: 210,
      height: 297,
      orientation: Orientation.LANDSCAPE
    }
  },
  config: {
    paperSettings: {
      type: "group",
    },
    cannySettings: {
      type: "group",
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractPaperFrom,
};

export default extractPaperStep;
