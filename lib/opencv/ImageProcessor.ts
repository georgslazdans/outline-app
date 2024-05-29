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
  intermediateData: ImageData[]; 
};

const processorOf = (
  processingFunctions: ProcessingFunction[],
  settings: Settings
) => {
  if (!processingFunctions || processingFunctions.length === 0) {
    throw new Error("No functions supplied to image processor");
  }
  const intermediateImageData: ImageData[] = [];

  return {
    process: (image: cv.Mat): cv.Mat => {
      const intermediateImages = [];
      let currentImage = image;
      for (const process of processingFunctions) {
        currentImage = process(currentImage, settings);
        intermediateImages.push(currentImage);
        intermediateImageData.push(imageDataOf(currentImage));
      }
      const result = intermediateImages.pop();
      intermediateImages.forEach((it) => it.delete());
      return result!!;
    },
    intermediateImageData: (): ImageData[] => {
      return intermediateImageData;
    }
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

  const processor = processorOf(processingFunctions, settings);
  const paperImage = processor.process(image);

  const objectContours = largestObjectContoursOf(paperImage);
  // TODO this image is only for debugging?
  // The SVG should be visible in the editor, but might need a preview, when skiping initializing threejs when just exporting svg?
  // Then just show the SVG with HTML, no?
  const resultingImage = drawLargestContour(
    image.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  // const resultImageData = imageDataOf(resultingImage);
  const resultImageData = imageDataOf(paperImage);
  const points = pointsFrom(objectContours.largestContour);

  image.delete();
  paperImage.delete();
  objectContours.delete();

  return {
    imageData: resultImageData,
    svg: Svg.from(points),
    intermediateData: processor.intermediateImageData()
  };
};

const imageDataOf = (image: cv.Mat): ImageData => {
  console.log("image", image, image.data.length);
  console.log("image cols", image.cols, image.rows);
  console.log("image channels", image.channels());
  let dst = new cv.Mat();
  image.convertTo(dst, cv.CV_8U);
  cv.cvtColor(dst, dst, colorSpaceOf(image));
  return new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows);
};

const colorSpaceOf = (image: cv.Mat) => {
  const channels = image.channels();
  switch (channels) {
    case 1:
      return cv.COLOR_GRAY2RGBA;
    case 3:
      return cv.COLOR_RGB2RGBA;
  }
};
