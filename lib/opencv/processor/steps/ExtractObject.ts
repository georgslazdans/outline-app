import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
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
import holeFinder, { HoleSettings } from "../../util/contours/Holes";

type SnoothSettings = {
  smoothOutline: boolean;
  smoothAccuracy: number;
};

type ExtractObjectSettings = {
  smoothSettings: SnoothSettings;
  holeSettings: HoleSettings;
  debugContours: boolean;
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

  const outlineContourIndex = largestContourOf(objectContours.contours);
  if (!outlineContourIndex) {
    console.log("Object contour not found!", this);
    return { image: copyOf(image) };
  }

  const outlineContour = handleContourSmoothing(
    objectContours.contours.get(outlineContourIndex)
  );

  const points = pointsFrom(outlineContour);

  const holes = holeFinder()
    .withImage(previous.intermediateImageOf(StepName.BLUR_OBJECT))
    .withSettings(settings.holeSettings)
    .withContourProcesing(handleContourSmoothing)
    .findHolesInContour(objectContours, outlineContourIndex);

  const scaleFactor = scaleFactorFrom(previous);
  const scaledHoles = holes.map((it) => scalePoints(it, 1 / scaleFactor));
  const scaledPoints = scalePoints(points, 1 / scaleFactor);

  const resultingImage = contourShapeOf([...holes, points]).drawImageOfSize(
    image.size()
  );
  if (settings.debugContours) {
    const darkBlue = new cv.Scalar(44, 125, 148);
    const lineThickness = 5;
    const debugContours = drawAllContoursChild(
      image.size(),
      objectContours,
      outlineContourIndex,
      darkBlue,
      lineThickness
    );
    cv.add(resultingImage, debugContours, resultingImage);
    debugContours.delete();
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
    smoothSettings: {
      smoothOutline: true,
      smoothAccuracy: 2,
    },
    holeSettings: {
      meanThreshold: 10,
      holeAreaTreshold: 1.0,
    },
    debugContours: true,
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
          step: 0.01,
        },
      },
    },
    debugContours: {
      type: "checkbox",
    },
  },
  imageColorSpace: ColorSpace.RGB,
  process: extractObjectFrom,
};

export default extractObjectStep;
