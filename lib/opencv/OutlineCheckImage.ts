import * as cv from "@techstark/opencv-js";
import Point from "../Point";
import StepResult from "./StepResult";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import thresholdStep from "./steps/Threshold";
import imageWarper from "./ImageWarper";
import imageDataOf, { imageOf } from "./ImageData";
import ColorSpace from "./ColorSpace";

const outlineCheckImageOf = (steps: StepResult[]): ImageData => {
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
    thresholdImage.size()
  );

  const finalImage = new cv.Mat();
  cv.add(thresholdImage, reverseWarped, finalImage);
  const result = imageDataOf(finalImage);

  finalImage.delete();
  thresholdImage.delete();
  objectImage.delete();
  reverseWarped.delete();

  return result;
};

const reverseWarpedImageOf = (
  cornerPoints: Point[],
  image: cv.Mat,
  imageSize: cv.Size
): cv.Mat => {
  const scale = 4;
  const paperWidth = 297 * scale;
  const paperHeight = 210 * scale;

  return imageWarper()
    .withPaperSettings(paperWidth, paperHeight)
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
