import Point, { lengthOf } from "@/lib/data/Point";
import StepName from "@/lib/opencv/processor/steps/StepName";
import Settings from "@/lib/opencv/Settings";
import StepResult from "@/lib/opencv/StepResult";
import {
  paperDimensionsOf,
  PaperDimensions,
} from "@/lib/opencv/PaperSettings";
import CalibrationSettingStep from "@/components/calibration/simple/settings/CalibrationSettingStep";
import { pngSizeOf } from "@/lib/utils/ImagePng";

/**
 * Pixels-per-millimetre derived from the paper quad itself, for the paper steps
 * where the displayed image is the (resized) photo rather than the extracted,
 * deskewed paper. The quad's pixel perimeter is spread over the paper's known
 * real-world perimeter, which is orientation agnostic and averages out mild
 * perspective distortion — good enough for sanity checks before extraction.
 *
 * Returns `undefined` when there are too few points to form a loop.
 */
export const pxPerMmFromPaperQuad = (
  points: Point[],
  paperDimensions: PaperDimensions
): number | undefined => {
  if (!points || points.length < 3) {
    return undefined;
  }
  let perimeterPx = 0;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    perimeterPx += lengthOf(points[i], next);
  }
  const perimeterMm = 2 * (paperDimensions.width + paperDimensions.height);
  if (perimeterMm <= 0) {
    return undefined;
  }
  return perimeterPx / perimeterMm;
};

/**
 * Mirrors `scaleFactorOf` in `lib/opencv/processor/ImageWarper.ts` (the factor
 * `FilterObjects` uses to turn on-screen pixels into exported millimetres), but
 * kept local so this module stays free of the OpenCV dependency and unit-testable.
 */
const minScaleFactor = (
  imageSize: { width: number; height: number },
  paperDimensions: PaperDimensions
): number => {
  const widthScaleFactor = imageSize.width / paperDimensions.width;
  const heightScaleFactor = imageSize.height / paperDimensions.height;
  return Math.min(widthScaleFactor, heightScaleFactor);
};

const paperQuadFor = (
  stepResults: StepResult[],
  settings: Settings
): Point[] | undefined => {
  const findPaper = stepResults.find(
    (it) => it.stepName == StepName.FIND_PAPER_OUTLINE
  );
  const contours = findPaper?.contours;
  if (!contours || contours.length == 0) {
    return undefined;
  }
  // Same index clamping as OutlineImageSelector.currentPaperOutlineImages().
  const paperIndex = settings[StepName.EXTRACT_PAPER]?.paperIndex ?? 0;
  const index =
    paperIndex >= contours.length ? contours.length - 1 : paperIndex;
  const quad = contours[index]?.outline?.points;
  return quad && quad.length >= 3 ? quad : undefined;
};

type PxPerMmInput = {
  settingStep: CalibrationSettingStep;
  stepResults: StepResult[];
  settings: Settings;
};

/**
 * Resolves the on-screen scale (pixels per millimetre) for the currently
 * displayed image, or `undefined` when no scale can be derived (the readout then
 * falls back to pixels).
 *
 * - Paper steps: the displayed image is the resized photo, so the scale comes
 *   from the paper quad (see {@link pxPerMmFromPaperQuad}).
 * - Object steps: the displayed image is the extracted paper, warped so the
 *   paper fills the frame at `min(resizeWidth / paperWidth, resizeHeight /
 *   paperHeight)` px/mm — identical to `FilterObjects`, so on-screen
 *   measurements match the exported/edited millimetre contours.
 * - Paper detection skipped: no paper, no scale.
 */
export const pxPerMmFor = ({
  settingStep,
  stepResults,
  settings,
}: PxPerMmInput): number | undefined => {
  const paperDimensions = paperDimensionsOf(
    settings[StepName.EXTRACT_PAPER].paperSettings
  );

  const isPaperStep =
    settingStep == CalibrationSettingStep.FIND_PAPER ||
    settingStep == CalibrationSettingStep.CLOSE_CORNERS_PAPER;

  if (isPaperStep) {
    const quad = paperQuadFor(stepResults, settings);
    if (!quad) {
      return undefined;
    }
    return pxPerMmFromPaperQuad(quad, paperDimensions);
  }

  const paperSkipped =
    settings[StepName.INPUT]?.skipPaperDetection === true;
  if (paperSkipped) {
    return undefined;
  }

  const resizeImage = stepResults.find(
    (it) => it.stepName == StepName.RESIZE_IMAGE
  );
  if (!resizeImage) {
    return undefined;
  }
  const size = pngSizeOf(resizeImage.pngBuffer);
  if (!size) {
    return undefined;
  }
  return minScaleFactor(size, paperDimensions);
};
