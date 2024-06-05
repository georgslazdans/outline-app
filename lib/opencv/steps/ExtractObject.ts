import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import {
  contoursOf,
  drawLargestContour,
  largestContourOf,
  smoothOf,
} from "../Contours";
import cannyStep from "./Canny";
import { pointsFrom } from "../../Point";
import StepName from "./StepName";

const cannyOf = cannyStep.process;
type CannySettings = typeof cannyStep.settings;

type ExtractObjectSettings = {
  smoothOutline: boolean;
  cannySettings: CannySettings;
};

const extractObjectFrom: Process<ExtractObjectSettings> = (
  image: cv.Mat,
  settings: ExtractObjectSettings
): ProcessResult => {
  const objectContours = contoursOf(
    cannyOf(image, settings.cannySettings).image
  );

  const countourIndex = largestContourOf(objectContours.contours);
  if (!countourIndex) {
    console.log("Object contour not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }
  // Output smoothing should be optional in the last step
  // let resultingContour = smoothOf(objectContours.contours.get(countourIndex));
  let resultingContour = objectContours.contours.get(countourIndex);

  // TODO this image is only for debugging?
  // The SVG should be visible in the editor, but might need a preview, when skiping initializing threejs when just exporting svg?
  // Then just show the SVG with HTML, no?
  const resultingImage = drawLargestContour(
    image.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  const points = pointsFrom(resultingContour, 4);

  objectContours.delete();

  return { image: resultingImage, points: points };
};

const extractObjectStep: ProcessingStep<ExtractObjectSettings> = {
  name: StepName.EXTRACT_OBJECT,
  settings: {
    smoothOutline: true,
    cannySettings: {
      firstThreshold: 100,
      secondThreshold: 200,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractObjectFrom,
};

export default extractObjectStep;
