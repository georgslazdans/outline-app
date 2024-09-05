import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  PreviousData,
  Process,
  ProcessResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import Point from "../../../data/Point";
import { contoursOf, largestContourOf } from "../../util/contours/Contours";
import StepName from "./StepName";
import imageWarper from "../ImageWarper";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSettings, { paperDimensionsOf } from "../../PaperSettings";
import Options from "@/lib/utils/Options";
import Settings, { inSettings } from "../../Settings";
import { pointsFrom } from "@/lib/data/contour/ContourPoints";

export enum ReuseStep {
  BLUR = StepName.BLUR,
  NONE = "none",
}
const dictionaryPath = "reuseStep";

export const reuseStepOptionsFor = (dictionary: any) =>
  Options.of(ReuseStep).withTranslation(dictionary, dictionaryPath);

type ExtractPaperSettings = {
  reuseStep: ReuseStep;
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

  const previousStep = stepNameOfReuseStep(settings.reuseStep);
  const previousImage = previous.intermediateImageOf(previousStep);
  const result = warpedImageOf(
    cornerPoints.points,
    previousImage,
    settings.paperSettings
  );

  contours.delete();
  hierarchy.delete();
  smoothedContour.delete();

  return { image: result, contours: [cornerPoints] };
};

const stepNameOfReuseStep = (reuseStep: ReuseStep) => {
  switch (reuseStep) {
    case ReuseStep.BLUR:
      return StepName.BLUR;
    case ReuseStep.NONE:
      return StepName.BILATERAL_FILTER;
  }
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

const imageColorSpace = (settings: Settings): ColorSpace => {
  if (inSettings(settings).isBlurReused()) {
    return ColorSpace.GRAY_SCALE;
  } else {
    return ColorSpace.RGBA;
  }
};

const extractPaperStep: ProcessingStep<ExtractPaperSettings> = {
  name: StepName.EXTRACT_PAPER,
  settings: {
    reuseStep: ReuseStep.BLUR,
    paperSettings: {
      width: 210,
      height: 297,
      orientation: Orientation.LANDSCAPE,
    },
  },
  config: {
    reuseStep: {
      type: "select",
      optionsFunction: reuseStepOptionsFor,
    },
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
  },
  imageColorSpace: imageColorSpace,
  process: extractPaperFrom,
};

export default extractPaperStep;
