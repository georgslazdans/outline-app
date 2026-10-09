import StepName from "@/lib/opencv/processor/steps/StepName";
import Settings, { inSettings } from "@/lib/opencv/Settings";
import StepResult, { hasImageData } from "@/lib/opencv/StepResult";
import {
  paperDimensionsOf,
  PaperDimensions,
} from "@/lib/opencv/PaperSettings";
import { pngSizeOf } from "@/lib/utils/ImagePng";

/**
 * Mirrors `scaleFactorOf` in `lib/opencv/processor/ImageWarper.ts`, kept local so
 * this module stays free of the OpenCV dependency.
 */
const minScaleFactor = (
  imageSize: { width: number; height: number },
  paperDimensions: PaperDimensions
): number => {
  const widthScaleFactor = imageSize.width / paperDimensions.width;
  const heightScaleFactor = imageSize.height / paperDimensions.height;
  return Math.min(widthScaleFactor, heightScaleFactor);
};

type PxPerMmInput = {
  stepResults: StepResult[];
  settings: Settings;
};

const pxPerMmOfStep = (
  stepResults: StepResult[],
  stepName: StepName,
  paperDimensions: PaperDimensions
): number | undefined => {
  const step = stepResults.find((it) => it.stepName == stepName);
  // Step results start out as empty placeholders, before the worker has run them.
  if (!step || !hasImageData(step)) {
    return undefined;
  }
  return minScaleFactor(pngSizeOf(step.pngBuffer), paperDimensions);
};

/** Pixels per millimetre of the displayed image, or undefined to fall back to px. */
export const pxPerMmFor = ({
  stepResults,
  settings,
}: PxPerMmInput): number | undefined => {
  const paperDimensions = paperDimensionsOf(
    settings[StepName.EXTRACT_PAPER].paperSettings
  );

  // Paper detection skipped: the whole resized image is the paper.
  if (inSettings(settings).isPaperDetectionSkipped()) {
    return pxPerMmOfStep(stepResults, StepName.RESIZE_IMAGE, paperDimensions);
  }

  // Otherwise the displayed image is the extracted, deskewed paper.
  return pxPerMmOfStep(stepResults, StepName.EXTRACT_PAPER, paperDimensions);
};
