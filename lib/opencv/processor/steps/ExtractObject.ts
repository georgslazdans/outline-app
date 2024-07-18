import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  ContourPoints,
  PreviousData,
  Process,
  ProcessResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import {
  fancyContoursOf,
  largestContourOf,
  smoothOf,
} from "../../util/contours/Contours";
import { pointsFrom, scalePoints } from "../../../Point";
import StepName from "./StepName";
import { scaleFactorOf } from "../ImageWarper";
import { paperDimensionsOf } from "../../PaperSettings";
import {
  contourShapeOf,
  drawAllContoursChild,
} from "../../util/contours/Drawing";
import holeFinder, {
  HoleSettings,
  contourPointsOf,
} from "../../util/contours/Holes";

type SnoothSettings = {
  smoothOutline: boolean;
  smoothAccuracy: number;
};

type ExtractObjectSettings = {
  smoothSettings: SnoothSettings;
  holeSettings: HoleSettings;
};

const extractObjectFrom: Process<ExtractObjectSettings> = (
  image: cv.Mat,
  settings: ExtractObjectSettings,
  previous: PreviousData
): ProcessResult => {
  const copyOf = (image: cv.Mat) => {
    const result = new cv.Mat();
    image.copyTo(result);
    return result;
  };
  const handleContourSmoothing = (contour: cv.Mat) => {
    return settings.smoothSettings.smoothOutline
      ? smoothOf(contour, settings.smoothSettings.smoothAccuracy / 10000)
      : copyOf(contour);
  };
  const objectContours = fancyContoursOf(image);

  const outlineContourIndex = largestContourOf(
    objectContours.contours,
    imageAreaThresholdSizeOf(image)
  );
  if (outlineContourIndex == null) {
    console.log("Object contour not found!", this);
    return { image: copyOf(image) };
  }

  const holeIndexes = holeFinder()
    .withImage(previous.intermediateImageOf(StepName.BLUR_OBJECT))
    .withSettings(settings.holeSettings)
    .findHolesInContour(objectContours, outlineContourIndex);

  const outlineContour = handleContourSmoothing(
    objectContours.contours.get(outlineContourIndex)
  );

  const outlinePoints = pointsFrom(outlineContour);
  const holePoints = contourPointsOf(
    objectContours,
    holeIndexes,
    handleContourSmoothing
  );

  const resultingImage = contourShapeOf([
    ...holePoints,
    outlinePoints,
  ]).drawImageOfSize(image.size());

  const darkBlue = new cv.Scalar(44, 125, 148);
  const lineThickness = 5;
  const otherContours = drawAllContoursChild(
    image.size(),
    objectContours,
    outlineContourIndex,
    darkBlue,
    lineThickness,
    holeIndexes
  );
  cv.add(resultingImage, otherContours, resultingImage);
  otherContours.delete();

  objectContours.delete();
  outlineContour.delete();

  return {
    image: resultingImage,
    contours: scaledResultOf(holePoints, outlinePoints, previous),
  };
};

const imageAreaThresholdSizeOf = (image: cv.Mat) => {
  const { width, height } = image.size();
  return width * height * 0.95;
};

const scaledResultOf = (
  holes: ContourPoints[],
  outline: ContourPoints,
  previous: PreviousData
) => {
  const scaleFactor = scaleFactorFrom(previous);
  const scaledHoles = holes.map((it) => scalePoints(it, 1 / scaleFactor));
  const scaledOutline = scalePoints(outline, 1 / scaleFactor);
  return [...scaledHoles, scaledOutline];
};

const scaleFactorFrom = (previous: PreviousData) => {
  const paperDimensions = paperDimensionsOf(
    previous.settingsOf(StepName.EXTRACT_PAPER).paperSettings
  );
  const imageSize = previous.intermediateImageOf(StepName.INPUT).size();
  return scaleFactorOf(imageSize, paperDimensions);
};

const extractObjectStep: ProcessingStep<ExtractObjectSettings> = {
  name: StepName.EXTRACT_OBJECT,
  settings: {
    smoothSettings: {
      smoothOutline: true,
      smoothAccuracy: 2,
    },
    holeSettings: {
      meanThreshold: 10,
      holeAreaTreshold: 1.0,
    },
  },
  config: {
    smoothSettings: {
      type: "group",
      config: {
        smoothOutline: {
          type: "checkbox",
        },
        smoothAccuracy: {
          type: "number",
          min: 0,
          max: 100,
          step: 0.1,
          display: (settings, currentStep) =>
            settings[currentStep]?.smoothSettings.smoothOutline,
        },
      },
    },
    holeSettings: {
      type: "group",
      config: {
        meanThreshold: {
          type: "number",
          min: 0,
          max: 30,
        },
        holeAreaTreshold: {
          type: "number",
          min: 0,
          max: 20,
          step: 0.1,
        },
      },
    },
  },
  imageColorSpace: () => ColorSpace.RGB,
  process: extractObjectFrom,
};

export default extractObjectStep;
