import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";
import {
  ProcessingFunction,
  blurOf,
  cannyOf,
  debugPaperOutline,
  extractPaperFrom,
  grayScaleOf,
} from "./ProcessingFunctions";
import {
  drawAllContours,
  drawLargestContour,
  largestObjectContoursOf,
} from "./Contours";
import { pointsFrom } from "./Point";
import Svg from "./Svg";

export type OutlineResult = {
  imageData: ImageData;
  svg: string;
  intermediateData: IntermediateData[];
};

export type IntermediateData = {
  imageData: ImageData;
  stepName: string;
};

const processorOf = (
  processingFunctions: ProcessingFunction[],
  settings: Settings,
  debugSteps: any
) => {
  if (!processingFunctions || processingFunctions.length === 0) {
    throw new Error("No functions supplied to image processor");
  }
  const intermediateImageData: IntermediateData[] = [];
  const drawDebugSteps = (image: cv.Mat, process: ProcessingFunction) => {
    if (debugSteps[process.name]) {
      for (const debugStep of debugSteps[process.name]) {
        const debugImage = debugStep(image, settings);
        intermediateImageData.push({
          imageData: imageDataOf(debugImage),
          stepName: debugStep.name,
        });
      }
    }
  }

  return {
    process: (image: cv.Mat): cv.Mat => {
      const intermediateImages = [];
      let currentImage = image;
      for (const process of processingFunctions) {
        drawDebugSteps(currentImage, process)

        currentImage = process(currentImage, settings);
        intermediateImages.push(currentImage);

        intermediateImageData.push({
          imageData: imageDataOf(currentImage),
          stepName: process.name,
        });
      }
      const result = intermediateImages.pop();
      intermediateImages.forEach((it) => it.delete());
      return result!!;
    },
    intermediateImageData: (): IntermediateData[] => {
      return intermediateImageData;
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

  const debugSteps = {
    [extractPaperFrom.name]: [debugPaperOutline],
  };

  const processor = processorOf(processingFunctions, settings, debugSteps);
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
  const resultImageData = imageDataOf(resultingImage);
  const points = pointsFrom(objectContours.largestContour);

  const test = drawAllContours(
    paperImage.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  processor
    .intermediateImageData()
    .push({ imageData: imageDataOf(test), stepName: "test-outline" });

  image.delete();
  paperImage.delete();
  objectContours.delete();

  return {
    imageData: resultImageData,
    svg: Svg.from(points),
    intermediateData: processor.intermediateImageData(),
  };
};

const imageDataOf = (image: cv.Mat): ImageData => {
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
