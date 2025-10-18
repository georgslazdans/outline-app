import * as cv from "@techstark/opencv-js";
import StepResult, { findStep } from "../../StepResult";
import imageDataOf, { convertBlackToTransparent } from "../../util/ImageData";
import StepName from "../steps/StepName";
import { drawContourOutlines } from "../../util/contours/Drawing";
import { decodePngToImageData, encodeImageDataToPngBuffer } from "@/lib/utils/ImagePng";

const objectOutlineImagesOf = async (
  steps: StepResult[]
): Promise<ArrayBuffer[]> => {
  const findObjectOutlines = findStep(StepName.FIND_OBJECT_OUTLINES).in(steps);

  if (!findObjectOutlines || !findObjectOutlines.contours) {
    console.warn("No outline images for objects!");
    return [new ArrayBuffer(0)];
  }

  const imageData = await decodePngToImageData(findObjectOutlines.pngBuffer);
  const imageSize = new cv.Size(imageData.width, imageData.height);
  const contourOutlines = findObjectOutlines.contours.map((it) => {
    const image = drawContourOutlines([it], imageSize);
    const result = convertBlackToTransparent(imageDataOf(image));
    image.delete();
    return result;
  });
  return Promise.all(
    contourOutlines.map(async (it) => await encodeImageDataToPngBuffer(it))
  );
};

export default objectOutlineImagesOf;
