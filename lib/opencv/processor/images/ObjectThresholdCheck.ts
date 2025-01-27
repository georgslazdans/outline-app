import * as cv from "@techstark/opencv-js";
import Point from "../../../data/Point";
import StepResult from "../../StepResult";
import imageWarper from "../ImageWarper";
import imageDataOf, { imageOf } from "../../util/ImageData";
import ColorSpace from "../../util/ColorSpace";
import PaperSettings, {
  paperDimensionsOf,
  paperSettingsOf,
} from "../../PaperSettings";
import Settings from "../../Settings";
import StepName from "../steps/StepName";

// TODO No longer used
const objectThresholdCheckOf = (
  steps: StepResult[],
  settings: Settings
): ImageData | undefined => {
  const input = findStep(StepName.INPUT).in(steps);
  const extractPaper = findStep(StepName.EXTRACT_PAPER).in(steps);
  const objectThreshold = findStep(StepName.OBJECT_THRESHOLD).in(steps);

  const imageSize = new cv.Size(input.imageData.width, input.imageData.height);

  if (!extractPaper.contours || extractPaper.contours.length == 0) {
    console.warn("No paper points for outline image!");
    return undefined;
  }
  if (!objectThreshold || !objectThreshold.imageData) {
    return undefined;
  }

  const paperContours = extractPaper.contours[0];

  const objectThresholdImage = imageOf(
    objectThreshold.imageData,
    ColorSpace.RGBA
  );

  const warped = reverseWarpedImageOf(
    paperContours.points,
    objectThresholdImage,
    imageSize,
    paperSettingsOf(settings)
  );

  const result = imageDataOf(warped);

  objectThresholdImage.delete();
  warped.delete();

  return result;
};

const reverseWarpedImageOf = (
  paperCornerPoints: Point[],
  image: cv.Mat,
  imageSize: cv.Size,
  paperSettings: PaperSettings
): cv.Mat => {
  return imageWarper()
    .withPaperSize(paperDimensionsOf(paperSettings))
    .andPaperContour(paperCornerPoints)
    .reverseWarpImage(image, imageSize);
};

const findStep = (stepName: StepName) => {
  return {
    in: (steps: StepResult[]) => {
      return steps.find((it) => it.stepName == stepName)!;
    },
  };
};

export default objectThresholdCheckOf;
