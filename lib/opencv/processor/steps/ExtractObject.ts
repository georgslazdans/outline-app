import * as cv from "@techstark/opencv-js";
import ProcessingStep, { Process, ProcessResult } from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import {
  contourShapeOf,
  contoursOf,
  drawAllContours,
  fancyContoursOf,
  largestContourOf,
  smoothOf,
} from "../../util/Contours";
import { pointsFrom } from "../../../Point";
import StepName from "./StepName";

type ExtractObjectSettings = {
  smoothOutline: boolean;
  smoothAccuracy: number;
};

const extractObjectFrom: Process<ExtractObjectSettings> = (
  image: cv.Mat,
  settings: ExtractObjectSettings,
  intermediateImageOf: (stepName: StepName) => cv.Mat
): ProcessResult => {
  const objectContours = fancyContoursOf(
    image
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
  const points = pointsFrom(resultingContour);
  const resultingImage = contourShapeOf(points)
    .asRGB()
    .drawImageOfSize(image.size());


  // const resultingImage = drawAllContours(image.size(), objectContours);

  objectContours.delete();
  resultingContour.delete();

  return { image: resultingImage, points: points };
};

const extractObjectStep: ProcessingStep<ExtractObjectSettings> = {
  name: StepName.EXTRACT_OBJECT,
  settings: {
    smoothOutline: true,
    smoothAccuracy: 2,
  },
  config: {
    smoothOutline: {
      type: "checkbox",
    },
    smoothAccuracy: {
      type: "number",
      min: 0,
      max: 100,
    }
  },
  imageColorSpace: ColorSpace.RGB,
  process: extractObjectFrom,
};

export default extractObjectStep;
