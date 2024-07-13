import * as cv from "@techstark/opencv-js";
import Point from "../../Point";
import StepResult from "../StepResult";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import imageWarper from "./ImageWarper";
import imageDataOf, { imageOf } from "../util/ImageData";
import ColorSpace from "../util/ColorSpace";
import PaperSettings, {
  paperDimensionsOf,
  paperSettingsOf,
} from "../PaperSettings";
import Settings from "../Settings";
import { contourShapeOf } from "../util/contours/Drawing";

const outlineCheckImageOf = (
  steps: StepResult[],
  settings: Settings
): ImageData => {
  const threshold = thresholdResultOf(steps);
  const extractPaper = extractPaperResultOf(steps);
  const extractObject = extractObjectResultOf(steps);

  if (!extractPaper.contours || extractPaper.contours.length == 0) {
    console.warn("No paper points for outline image!");
    return new ImageData(1, 1);
  }
  const paperContours = extractPaper.contours[0];

  const thresholdImage = imageOf(threshold.imageData, ColorSpace.RGBA);
  const objectImage = imageOf(extractObject.imageData, ColorSpace.RGBA);
  const objectContourImage = reverseWarpedImageOf(
    paperContours.points,
    objectImage,
    thresholdImage.size(),
    paperSettingsOf(settings)
  );

  const blue = new cv.Scalar(18, 150, 182);
  const paperContourImage = contourShapeOf(extractPaper.contours)
    .withColour(blue)
    .drawImageOfSize(thresholdImage.size());

  const thresholdWithObject = combineImages(thresholdImage, objectContourImage);
  const finalImage = combineImages(thresholdWithObject, paperContourImage);
  const result = imageDataOf(finalImage);

  finalImage.delete();
  thresholdImage.delete();
  objectImage.delete();
  objectContourImage.delete();
  paperContourImage.delete();
  thresholdWithObject.delete();

  return result;
};

const combineImages = (imageA: cv.Mat, imageB: cv.Mat) => {
  const combinedImage = new cv.Mat();
  const mask = new cv.Mat();
  const invertedMask = new cv.Mat();

  cv.cvtColor(imageB, mask, cv.COLOR_RGBA2GRAY, 0);
  cv.bitwise_not(mask, invertedMask);

  cv.bitwise_and(imageA, imageA, combinedImage, invertedMask);
  cv.bitwise_and(imageB, imageB, combinedImage, mask);

  mask.delete();
  invertedMask.delete();
  return combinedImage;
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

const thresholdResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == adaptiveThresholdStep.name)!;
};

const extractPaperResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == extractPaperStep.name)!;
};

const extractObjectResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == extractObjectStep.name)!;
};

export default outlineCheckImageOf;
