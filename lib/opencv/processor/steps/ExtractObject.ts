import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import {
  fancyContoursOf,
  largestContourOf,
  smoothOf,
} from "../../util/contours/Contours";
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
import ContourPoints, { modifyContour, modifyContourList, pointsFrom } from "@/lib/data/contour/ContourPoints";

type SmoothSettings = {
  smoothOutline: boolean;
  smoothAccuracy: number;
};

type ExtractObjectSettings = {
  smoothSettings: SmoothSettings;
  holeSettings: HoleSettings;
};

const OBJECT_NOT_FOUND_MESSAGE = "Object contour not found!";

const extractObjectFrom: Process<ExtractObjectSettings> = (
  image: cv.Mat,
  settings: ExtractObjectSettings,
  previous: PreviousData
): ProcessFunctionResult => {
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
    return { errorMessage: OBJECT_NOT_FOUND_MESSAGE };
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
  const scaledHoles = modifyContourList(holes).scalePoints(1 / scaleFactor);
  const scaledOutline = modifyContour(outline).scalePoints(1 / scaleFactor);
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
      holeAreaThreshold: 1.0,
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
          tooltip: "Maximum deviation from original line as percentage"
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
        holeAreaThreshold: {
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
