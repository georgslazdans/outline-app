import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";
import {
  ProcessingFunction,
  bilateralFilter,
  blurOf,
  cannyOf,
  debugFindCountours,
  extractPaperFrom,
  grayScaleOf,
} from "./ProcessingFunctions";
import {
  drawAllContours,
  drawLargestContour,
  largestContourOf,
  largestObjectContoursOf,
  smoothOf,
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
  };

  return {
    process: (image: cv.Mat): cv.Mat => {
      const intermediateImages = [];
      let currentImage = image;
      for (const process of processingFunctions) {
        drawDebugSteps(currentImage, process);

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
    addIntermediateStep: (image: cv.Mat, name: string) => {
      intermediateImageData
      .push({ imageData: imageDataOf(image), stepName: name });
    }
  };
};

export const processImage = async (
  imageData: ImageData,
  settings: Settings
): Promise<OutlineResult> => {
  const image = cv.matFromImageData(imageData);
  const processingFunctions: ProcessingFunction[] = [
    bilateralFilter,
    grayScaleOf,
    blurOf,
    cannyOf,
    extractPaperFrom,
  ];

  const debugSteps = {
    [extractPaperFrom.name]: [debugFindCountours],
    // [grayScaleOf.name]: [debugFindCountours],
  };

  const processor = processorOf(processingFunctions, settings, debugSteps);
  processor.addIntermediateStep(image, "Input")

  const paperImage = processor.process(image);

  const objectContours = largestObjectContoursOf(paperImage);

  const countourIndex = largestContourOf(objectContours.contours);
  if (!countourIndex) {
    console.log("Object contour not found!", this);
    return {
      imageData: new ImageData(1, 1),
      svg: "",
      intermediateData: processor.intermediateImageData(),
    };
  }
  let resultingContour = smoothOf(objectContours.contours.get(countourIndex));

  // TODO this image is only for debugging?
  // The SVG should be visible in the editor, but might need a preview, when skiping initializing threejs when just exporting svg?
  // Then just show the SVG with HTML, no?
  const resultingImage = drawLargestContour(
    paperImage.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  const resultImageData = imageDataOf(resultingImage);
  const points = pointsFrom(resultingContour);

  const test = drawAllContours(
    paperImage.size(),
    objectContours.contours,
    objectContours.hierarchy
  );
  processor.addIntermediateStep(test, "test-outline");
  processor.addIntermediateStep(resultingImage, "Output");

  image.delete();
  paperImage.delete();
  objectContours.delete();
  resultingImage.delete();

  return {
    imageData: resultImageData,
    svg: Svg.from(points),
    intermediateData: processor.intermediateImageData(),
  };
};

const imageDataOf = (image: cv.Mat): ImageData => {
  var convertedImage = convertImage(image);
  return new ImageData(
    new Uint8ClampedArray(convertedImage.data),
    convertedImage.cols,
    convertedImage.rows
  );
};

const convertImage = (image: cv.Mat): cv.Mat => {
  const channels = image.channels();
  if (channels == 4) {
    return image;
  }
  let destination = new cv.Mat();
  image.convertTo(destination, cv.CV_8U);
  cv.cvtColor(destination, destination, colorConversionOf(channels));
  return destination;
};

const colorConversionOf = (channels: number) => {
  switch (channels) {
    case 1:
      return cv.COLOR_GRAY2RGBA;
    case 3:
      return cv.COLOR_RGB2RGBA;
  }
};
