import * as cv from "@techstark/opencv-js";
import Point from "../../Point";
import StepResult from "../StepResult";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import imageWarper from "./ImageWarper";
import imageDataOf, { convertToRGBA, imageOf } from "../util/ImageData";
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

  const imageSize = new cv.Size(
    threshold.imageData.width,
    threshold.imageData.height
  );

  if (!extractPaper.contours || extractPaper.contours.length == 0) {
    console.warn("No paper points for outline image!");
    return new ImageData(1, 1);
  }
  const paperContours = extractPaper.contours[0];

  const objectImage = imageOf(extractObject.imageData, ColorSpace.RGBA);

  const objectContourImage = reverseWarpedImageOf(
    paperContours.points,
    objectImage,
    imageSize,
    paperSettingsOf(settings)
  );

  const blue = new cv.Scalar(18, 150, 182);
  const paperContourImageRGB = contourShapeOf(extractPaper.contours)
    .withColour(blue)
    .drawImageOfSize(imageSize);

  const paperContourImage = convertToRGBA(paperContourImageRGB);

  const finalImage = new cv.Mat();
  cv.add(objectContourImage, paperContourImage, finalImage);

  const result = convertBlackToTransperent(imageDataOf(finalImage));

  finalImage.delete();
  objectImage.delete();
  objectContourImage.delete();
  paperContourImage.delete();
  paperContourImageRGB.delete();

  return result;
};

const convertBlackToTransperent = (result: ImageData): ImageData => {
  const data = result.data;

  // Iterate through each pixel, converting black to transparent
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }
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
