import * as cv from "@techstark/opencv-js";
import StepResult, { findStep } from "../../StepResult";
import imageDataOf, {
  convertBlackToTransparent,
  convertToRGBA,
} from "../../util/ImageData";
import { contourShapeOf } from "../../util/contours/Drawing";
import StepName from "../steps/StepName";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import { decodePngToImageData, encodeImageDataToPngBuffer } from "@/lib/utils/ImagePng";

const paperOutlineImagesOf = async (
  steps: StepResult[]
): Promise<ArrayBuffer[]> => {
  const input = findStep(StepName.RESIZE_IMAGE).in(steps);
  const findPaper = findStep(StepName.FIND_PAPER_OUTLINE).in(steps);

  const contourOutlines = findPaper?.contours;
  if (!contourOutlines || contourOutlines.length == 0) {
    console.warn("No paper options for image!");
    return [new ArrayBuffer(0)];
  }

  const contours = contourOutlines.map((it) => it.outline);
  
  const imageData = await decodePngToImageData(input.pngBuffer);
  const imageSize = new cv.Size(imageData.width, imageData.height);

  const result: ImageData[] = [];
  for (const contour of contours) {
    result.push(contourImageOf(contour, imageSize));
  }
  return Promise.all(result.map(async (it) => encodeImageDataToPngBuffer(it)));
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
