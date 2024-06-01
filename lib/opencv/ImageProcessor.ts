import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";

import { StepResult } from "./StepResult";
import ProcessingStep, { StepSettings } from "./steps/ProcessingFunction";
import bilateralFilterFunction from "./steps/BilateralFilter";
import grayScaleFunction from "./steps/GrayScale";
import blurFunction from "./steps/Blur";
import thresholdFunction from "./steps/Threshold";
import extractPaperFunction from "./steps/ExtractPaper";
import extractObjectFunction from "./steps/ExtractObject";
import imageDataOf from "./ImageData";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

export type ProccessStep = {
  stepName: string;
  imageData: ImageData;
  settings: Settings;
};

export const processingFunctions: ProcessingStep<any>[] = [
  bilateralFilterFunction,
  grayScaleFunction,
  blurFunction,
  thresholdFunction,
  extractPaperFunction,
  extractObjectFunction,
];

const processorOf = (
  processingFunctions: ProcessingStep<any>[],
  settings: Settings
) => {
  if (!processingFunctions || processingFunctions.length === 0) {
    throw new Error("No functions supplied to image processor");
  }

  const settingsFor = (
    processingFunction: ProcessingStep<any>
  ): StepSettings => {
    const name = processingFunction.name;
    return settings[name];
  };

  const processStep = (
    image: cv.Mat,
    processingFunction: ProcessingStep<any>
  ): cv.Mat => {
    var settings = settingsFor(processingFunction);
    return processingFunction.process(image, settings);
  };

  return {
    process: (image: cv.Mat): StepResult[] => {
      const stepData: StepResult[] = [];
      const intermediateImages: any[] = [];
      let currentImage = image;
      for (const step of processingFunctions) {
        currentImage = processStep(currentImage, step);
        stepData.push({
          stepName: step.name,
          imageData: imageDataOf(currentImage),
        });
        intermediateImages.push(currentImage);
      }
      intermediateImages.forEach((it) => it.delete());
      return stepData;
    },
  };
};

const stepWithName = (name: string): ProcessingStep<any> => {
  const result = processingFunctions.find((it) => it.name === name);
  if (!result) {
    throw new Error("No processing function for name: " + name);
  }
  return result;
};

export const processStep = async (command: ProccessStep): Promise<StepResult[]> => {
  const step = stepWithName(command.stepName);
  const image = cv.matFromImageData(command.imageData);
  const steps = processorOf([step], command.settings).process(image);
  image.delete();
  return steps;
};

export const processImage = async (
  command: ProcessAll
): Promise<StepResult[]> => {
  const image = cv.matFromImageData(command.imageData);
  const steps = processorOf(processingFunctions, command.settings).process(
    image
  );
  image.delete();
  return steps;
};
