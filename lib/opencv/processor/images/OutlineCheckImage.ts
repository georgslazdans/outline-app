import * as cv from "@techstark/opencv-js";
import StepResult, { findStep } from "../../StepResult";
import imageDataOf, {
  convertBlackToTransparent,
} from "../../util/ImageData";
import StepName from "../steps/StepName";
import { drawContourOutlines } from "../../util/contours/Drawing";

const objectOutlineImagesOf = (
  steps: StepResult[],
): ImageData[] => {
  const findObjectOutlines = findStep(StepName.FIND_OBJECT_OUTLINES).in(steps);

  if (!findObjectOutlines || !findObjectOutlines.contours) {
    console.warn("No outline images for objects!");
    return [new ImageData(1, 1)];
  }

  const imageSize = new cv.Size(
    findObjectOutlines.imageData.width,
    findObjectOutlines.imageData.height
  );
  const contourOutlines = findObjectOutlines.contours.map((it) => {
    const image = drawContourOutlines([it], imageSize);
    const result = convertBlackToTransparent(imageDataOf(image));
    image.delete();
    return result;
  });
  return contourOutlines;
};

export default objectOutlineImagesOf;
