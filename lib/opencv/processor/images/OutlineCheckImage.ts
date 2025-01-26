import * as cv from "@techstark/opencv-js";
import Point from "../../../data/Point";
import StepResult, { findStep } from "../../StepResult";
import imageWarper from "../ImageWarper";
import imageDataOf, { convertBlackToTransparent, imageOf } from "../../util/ImageData";
import ColorSpace from "../../util/ColorSpace";
import PaperSettings, {
  paperDimensionsOf,
  paperSettingsOf,
} from "../../PaperSettings";
import Settings from "../../Settings";
import StepName from "../steps/StepName";

const outlineCheckImageOf = (
  steps: StepResult[],
  settings: Settings
): ImageData => {
  const input = findStep(StepName.INPUT).in(steps);
  const extractPaper = findStep(StepName.EXTRACT_PAPER).in(steps);
  const extractObject = findStep(StepName.EXTRACT_OBJECT).in(steps);

  const imageSize = new cv.Size(input.imageData.width, input.imageData.height);

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

  const result = convertBlackToTransparent(imageDataOf(objectContourImage));
  objectImage.delete();
  objectContourImage.delete();

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


export default outlineCheckImageOf;
