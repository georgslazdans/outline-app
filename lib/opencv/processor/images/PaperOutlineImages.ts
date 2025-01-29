import * as cv from "@techstark/opencv-js";
import StepResult, { findStep } from "../../StepResult";
import imageDataOf, {
  convertBlackToTransparent,
  convertToRGBA,
} from "../../util/ImageData";
import { contourShapeOf } from "../../util/contours/Drawing";
import StepName from "../steps/StepName";
import ContourPoints from "@/lib/data/contour/ContourPoints";

const paperOutlineImagesOf = (steps: StepResult[]): ImageData[] => {
  const input = findStep(StepName.INPUT).in(steps);
  const findPaper = findStep(StepName.FIND_PAPER_OUTLINE).in(steps);
  const imageSize = new cv.Size(input.imageData.width, input.imageData.height);

  const contourOutlines = findPaper?.contours;
  if (!contourOutlines || contourOutlines.length == 0) {
    console.warn("No paper options for image!");
    return [new ImageData(1, 1)];
  }

  const contours = contourOutlines.map((it) => it.outline);

  const result: ImageData[] = [];
  for (const contour of contours) {
    result.push(contourImageOf(contour, imageSize));
  }
  return result;
};

const blue = new cv.Scalar(18, 150, 182);

const contourImageOf = (
  contour: ContourPoints,
  imageSize: cv.Size
): ImageData => {
  const paperContourImageRGB = contourShapeOf([contour])
    .withColour(blue)
    .withStrokeWidth(15)
    .drawImageOfSize(imageSize);
  const paperContourImage = convertToRGBA(paperContourImageRGB);
  const result = convertBlackToTransparent(imageDataOf(paperContourImage));

  paperContourImage.delete();
  paperContourImageRGB.delete();
  return result;
};

export default paperOutlineImagesOf;
