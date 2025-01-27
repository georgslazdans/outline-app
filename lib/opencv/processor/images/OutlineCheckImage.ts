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
  const extractObject = findStep(StepName.EXTRACT_OBJECT).in(steps);

  if (!extractObject) {
    console.warn("No outline image for object!");
    return new ImageData(1, 1);
  }
  const objectImage = imageOf(extractObject.imageData, ColorSpace.RGBA);
  const result = convertBlackToTransparent(imageDataOf(objectImage));
  objectImage.delete();

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
