import * as cv from "@techstark/opencv-js";
import Point from "../Point";
import StepResult from "./StepResult";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import thresholdStep from "./steps/Threshold";
import imageWarper from "./ImageWarper";
import imageDataOf, { imageOf } from "./ImageData";
import ColorSpace from "./ColorSpace";
import { drawContourShape } from "./Contours";

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

  const paperContourImage = drawContourShape(
    extractPaper.points,
    thresholdImage.size(),
    new cv.Scalar(18, 150, 182)
  );

  // const combineImages = (imageA: cv.Mat, imageB: cv.Mat) => {
  //   const combinedImage = new cv.Mat();

  //   const binaryMask = cv.Mat.zeros(imageB.size(), cv.CV_8UC1);
  //   cv.threshold(imageB, binaryMask, 128, 255, cv.THRESH_BINARY);

  //   const inverseMask = cv.Mat.zeros(imageB.size(), cv.CV_8UC1);
  //   cv.bitwise_not(binaryMask, inverseMask);

  //   const mask = grayScaleStep.process(inverseMask, {}).image;

  //   cv.add(imageA, imageB, combinedImage, mask);

  //   binaryMask.delete();
  //   inverseMask.delete();

  //   return combinedImage;
  // };

  const combineImages = (imageA: cv.Mat, imageB: cv.Mat) => {
    const combinedImage = new cv.Mat();
    cv.add(imageA, imageB, combinedImage);
    return combinedImage;
  }

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
  imageSize: cv.Size
): cv.Mat => {
  const scale = 4;
  const paperWidth = 297 * scale;
  const paperHeight = 210 * scale;

  return imageWarper()
    .withPaperSize(paperWidth, paperHeight)
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
