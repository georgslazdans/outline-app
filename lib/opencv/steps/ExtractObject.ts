import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../ColorSpace";
import {
  contoursOf,
  drawContourShape,
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
  smoothAccuracy: number;
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

  const resultingContour = settings.smoothOutline
    ? smoothOf(
        objectContours.contours.get(countourIndex),
        settings.smoothAccuracy / 10000
      )
    : objectContours.contours.get(countourIndex);

  const points = pointsFrom(resultingContour, 4);

  const resultingImage = drawContourShape(pointsFrom(resultingContour), image.size());
  objectContours.delete();

  return { image: resultingImage, points: points };
};

const extractObjectStep: ProcessingStep<ExtractObjectSettings> = {
  name: StepName.EXTRACT_OBJECT,
  settings: {
    smoothOutline: true,
    smoothAccuracy: 2,
    cannySettings: {
      firstThreshold: 100,
      secondThreshold: 200,
    },
  },
  config: {
    smoothOutline: {
      type: "checkbox",
    },
    smoothAccuracy: {
      type: "number",
      min: 0,
      max: 100,
    },
    cannySettings: {
      type: "group",
      config: cannyStep.config!,
    },
  },
  imageColorSpace: ColorSpace.GRAY_SCALE,
  process: extractObjectFrom,
};

export default extractObjectStep;
