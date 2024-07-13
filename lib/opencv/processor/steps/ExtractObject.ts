import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import {
  contoursWithHolesFrom,
  fancyContoursOf,
  largestContourOf,
  smoothOf,
} from "../../util/contours/Contours";
import { pointsFrom } from "../../../Point";
import StepName from "./StepName";
import { scaleFactorOf } from "../ImageWarper";
import { paperDimensionsOf } from "../../PaperSettings";
import {
  contourShapeOf,
  drawAllContoursChild,
} from "../../util/contours/Drawing";

type ExtractObjectSettings = {
  meanThreshold: number;
  smoothOutline: boolean;
  smoothAccuracy: number;
  debugContours: boolean;
};

const extractObjectFrom: Process<ExtractObjectSettings> = (
  image: cv.Mat,
  settings: ExtractObjectSettings,
  previous: PreviousData
): ProcessResult => {
  const handleContourSmoothing = (contour: cv.Mat) => {
    return settings.smoothOutline
      ? smoothOf(contour, settings.smoothAccuracy / 10000)
      : contour;
  };
  const objectContours = fancyContoursOf(image);

  const outlineContourIndex = largestContourOf(objectContours.contours);
  if (!outlineContourIndex) {
    console.log("Object contour not found!", this);
    const result = new cv.Mat();
    image.copyTo(result);
    return { image: result };
  }

  const outlineContour = handleContourSmoothing(
    objectContours.contours.get(outlineContourIndex)
  );
  const scaleFactor = scaleFactorFrom(previous);

  const points = pointsFrom(outlineContour);
  const holes = contoursWithHolesFrom(
    objectContours,
    outlineContourIndex,
    previous.intermediateImageOf(StepName.BLUR_OBJECT),
    settings.meanThreshold,
    handleContourSmoothing
  );

  const scaledHoles = contoursWithHolesFrom(
    objectContours,
    outlineContourIndex,
    previous.intermediateImageOf(StepName.BLUR_OBJECT),
    settings.meanThreshold,
    handleContourSmoothing,
    scaleFactor
  );
  const scaledPoints = pointsFrom(outlineContour, scaleFactor);

  let resultingImage: cv.Mat;
  if (!settings.debugContours) {
    resultingImage = contourShapeOf([...holes, points])
      .asRGB()
      .drawImageOfSize(image.size());
  } else {
    resultingImage = drawAllContoursChild(
      image.size(),
      objectContours,
      outlineContourIndex
    );
  }

  objectContours.delete();
  outlineContour.delete();

  return { image: resultingImage, contours: [...scaledHoles, scaledPoints] };
};

const scaleFactorFrom = (previous: PreviousData) => {
  const paperDimensions = paperDimensionsOf(
    previous.settingsOf(StepName.EXTRACT_PAPER).paperSettings
  );
  const imageSize = previous
    .intermediateImageOf(StepName.BILETERAL_FILTER)
    .size();
  return scaleFactorOf(imageSize, paperDimensions);
};

const extractObjectStep: ProcessingStep<ExtractObjectSettings> = {
  name: StepName.EXTRACT_OBJECT,
  settings: {
    smoothOutline: true,
    smoothAccuracy: 2,
    meanThreshold: 10,
    debugContours: false,
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
    meanThreshold: {
      type: "number",
      min: 0,
      max: 30,
    },
    debugContours: {
      type: "checkbox",
    },
  },
  imageColorSpace: ColorSpace.RGB,
  process: extractObjectFrom,
};

export default extractObjectStep;
