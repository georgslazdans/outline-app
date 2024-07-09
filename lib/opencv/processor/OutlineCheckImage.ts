import * as cv from "@techstark/opencv-js";
import Point from "../../Point";
import StepResult from "../StepResult";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import thresholdStep from "./steps/Threshold";
import imageWarper from "./ImageWarper";
import imageDataOf, { imageOf } from "../util/ImageData";
import ColorSpace from "../util/ColorSpace";
import { contourShapeOf } from "../util/Contours";
import PaperSettings, { paperDimensionsOf, paperSettingsOf } from "../PaperSettings";
import Settings from "../Settings";

const outlineCheckImageOf = (
  steps: StepResult[],
  settings: Settings
): ImageData => {
  const threshold = thresholdResultOf(steps);
  const extractPaper = extractPaperResultOf(steps);
  const extractObject = extractObjectResultOf(steps);

  if (!extractPaper.points) {
    console.warn("No paper points for outline image!");
    return new ImageData(1, 1);
  }

  const thresholdImage = imageOf(threshold.imageData, ColorSpace.RGBA);
  const objectImage = imageOf(extractObject.imageData, ColorSpace.RGBA);
  const reverseWarped = reverseWarpedImageOf(
    extractPaper.points!,
    objectImage,
    thresholdImage.size(),
    paperSettingsOf(settings)
  );

  const blue = new cv.Scalar(18, 150, 182);
  const paperContourImage = contourShapeOf(extractPaper.points)
    .withColour(blue)
    .drawImageOfSize(thresholdImage.size());

  const combineImages = (imageA: cv.Mat, imageB: cv.Mat) => {
    const combinedImage = new cv.Mat();
    cv.add(imageA, imageB, combinedImage);
    return combinedImage;
  };

  const thresholdWithObject = combineImages(thresholdImage, reverseWarped);
  const finalImage = combineImages(thresholdWithObject, paperContourImage);
  const result = imageDataOf(finalImage);

  finalImage.delete();
  thresholdImage.delete();
  objectImage.delete();
  reverseWarped.delete();
  paperContourImage.delete();
  thresholdWithObject.delete();

  return result;
};

const reverseWarpedImageOf = (
  cornerPoints: Point[],
  image: cv.Mat,
  imageSize: cv.Size,
  paperSettings: PaperSettings
): cv.Mat => {
  return imageWarper()
    .withPaperSize(paperDimensionsOf(paperSettings))
    .andPaperContour(cornerPoints)
    .reverseWarpImage(image, imageSize);
};

const thresholdResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == thresholdStep.name)!;
};

const extractPaperResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == extractPaperStep.name)!;
};

const extractObjectResultOf = (steps: StepResult[]): StepResult => {
  return steps.find((it) => it.stepName == extractObjectStep.name)!;
};

export default outlineCheckImageOf;
