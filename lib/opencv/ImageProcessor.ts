import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";
import {
  ProcessingFunction,
  blurOf,
  cannyOf,
  extractPaperFrom,
  grayScaleOf,
} from "./ProcessingFunctions";
import { drawLargestContour, largestObjectContoursOf } from "./Contours";
import { pointsFrom } from "./Point";
import Svg from "./Svg";

export type OutlineResult = {
  imageData: ImageData;
  svg: string;
};

const processorOf = (
  processingFunctions: ProcessingFunction[],
  settings: Settings
) => {
  if (!processingFunctions || processingFunctions.length === 0) {
    throw new Error("No functions supplied to image processor");
  }
  return {
    process: (image: cv.Mat): cv.Mat => {
      const intermediateImages = [];
      let currentImage = image;
      for (const process of processingFunctions) {
        currentImage = process(currentImage, settings);
        intermediateImages.push(currentImage);
      }
      const result = intermediateImages.pop();
      intermediateImages.forEach((it) => it.delete());
      return result!!;
    },
  };
};

export const processImage = async (
  imageData: ImageData,
  settings: Settings
): Promise<OutlineResult> => {
  const image = cv.matFromImageData(imageData);
  const processingFunctions: ProcessingFunction[] = [
    grayScaleOf,
    blurOf,
    cannyOf,
    extractPaperFrom,
  ];
  const paperImage = processorOf(processingFunctions, settings).process(image);

  const objectContours = largestObjectContoursOf(paperImage);
  // TODO this image is only for debugging?
  // The SVG should be visible in the editor, but might need a preview, when skiping initializing threejs when just exporting svg?
  // Then just show the SVG with HTML, no?
  const resultingImage = drawLargestContour(
    image.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  const resultImageData = imageDataOf(resultingImage);
  const points = pointsFrom(objectContours.largestContour);

  image.delete();
  paperImage.delete();
  objectContours.delete();

  return {
    imageData: resultImageData,
    svg: Svg.from(points),
  };
};

const imageDataOf = (image: cv.Mat): ImageData => {
  console.log("image", image, image.data.length);
  console.log("image cols", image.cols, image.rows);
  let dst = new cv.Mat();
  // scale and shift are used to map the data to [0, 255].
  image.convertTo(dst, cv.CV_8U);
  // *** is GRAY, RGB, or RGBA, according to src.channels() is 1, 3 or 4.
  cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
  return new ImageData(
    new Uint8ClampedArray(dst.data),
    dst.cols,
    dst.rows
  );
};
