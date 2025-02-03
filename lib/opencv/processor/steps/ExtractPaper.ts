import * as cv from "@techstark/opencv-js";
import ProcessingStep, {
  Process,
  ProcessFunctionResult,
} from "./ProcessingFunction";
import ColorSpace from "../../util/ColorSpace";
import Point from "../../../data/Point";
import StepName from "./StepName";
import imageWarper from "../ImageWarper";
import Orientation, { orientationOptionsFor } from "@/lib/Orientation";
import PaperSettings, { paperDimensionsOf } from "../../PaperSettings";
import Options from "@/lib/utils/Options";
import Settings, { inSettings } from "../../Settings";
import ContourPoints, {
  modifyContour,
  queryContour,
} from "@/lib/data/contour/ContourPoints";
import PreviousData from "../PreviousData";

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
  shrinkPaper: number;
  paperIndex: number;
};

const extractPaperFrom: Process<ExtractPaperSettings> = (
  image: cv.Mat,
  settings: ExtractPaperSettings,
  previous: PreviousData
): ProcessFunctionResult => {
  const paperOutlineContours = previous.contoursOf(
    StepName.FIND_PAPER_OUTLINE
  )!;

  const index =
    settings.paperIndex >= paperOutlineContours.length
      ? paperOutlineContours.length - 1
      : settings.paperIndex;

  const cornerPoints = paperOutlineContours[index].outline;
  const scaledPoints = handlePaperShrinking(cornerPoints, settings.shrinkPaper);

  const previousStep = stepNameOfReuseStep(settings.reuseStep);
  const previousImage = previous.intermediateImageOf(previousStep);
  const result = warpedImageOf(
    scaledPoints.points,
    previousImage,
    settings.paperSettings
  );
  return { image: result, contours: [{ outline: scaledPoints }] };
};

const stepNameOfReuseStep = (reuseStep: ReuseStep) => {
  switch (reuseStep) {
    case ReuseStep.BLUR:
      return StepName.BLUR;
    case ReuseStep.NONE:
      return StepName.BILATERAL_FILTER;
  }
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

const handlePaperShrinking = (points: ContourPoints, shrinkPaper: number) => {
  if (shrinkPaper > 0) {
    const isClockwise = queryContour(points).arePointsClockwise();
    return modifyContour(points).scaleAlongNormal(
      isClockwise ? shrinkPaper : -shrinkPaper
    );
  } else {
    return points;
  }
};

const extractPaperStep: ProcessingStep<ExtractPaperSettings> = {
  name: StepName.EXTRACT_PAPER,
  settings: {
    reuseStep: ReuseStep.NONE,
    paperSettings: {
      width: 210,
      height: 297,
      orientation: Orientation.LANDSCAPE,
    },
    shrinkPaper: 0,
    paperIndex: 0,
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
    shrinkPaper: {
      type: "number",
      min: 0,
      max: 200,
      step: 0.01,
      tooltip: "Shrinks paper outline by given value in pixels",
    },
    paperIndex: {
      type: "paperOutlineSelect",
      tooltip: "Array index. Counting starts from 0",
    },
  },
  imageColorSpace: imageColorSpace,
  process: extractPaperFrom,
};

export default extractPaperStep;
