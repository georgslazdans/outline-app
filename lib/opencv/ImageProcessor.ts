import * as cv from "@techstark/opencv-js";
import Settings, { defaultSettings } from "./Settings";

import { StepResult } from "./StepResult";
import ProcessingStep, { StepSetting } from "./steps/ProcessingFunction";
import bilateralFilterFunction from "./steps/BilateralFilter";
import grayScaleFunction from "./steps/GrayScale";
import blurFunction from "./steps/Blur";
import thresholdFunction from "./steps/Threshold";
import extractPaperFunction from "./steps/ExtractPaper";
import extractObjectFunction from "./steps/ExtractObject";
import imageDataOf, { imageOf } from "./ImageData";
import ColorSpace from "./ColorSpace";
import { comma } from "postcss/lib/list";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

export type ProccessStep = {
  stepName: string;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
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
  ): StepSetting => {
    const name = processingFunction.name;
    return settings[name];
  };

  const processStep = (
    image: cv.Mat,
    processingFunction: ProcessingStep<any>
  ): cv.Mat => {
    try {
      var settings = settingsFor(processingFunction);
      return processingFunction.process(image, settings);
    } catch (e) {
      console.error("Failed to execute step: " + processingFunction.name, e);
      return processingFunction.process(image, defaultSettings()[processingFunction.name])
      // throw new Error("Failed to execute step: " + processingFunction.name);
    }
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
          imageColorSpace: step.imageColorSpace,
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

export const processStep = async (
  command: ProccessStep
): Promise<StepResult[]> => {
  const step = stepWithName(command.stepName);
  const image = imageOf(command.imageData, command.imageColorSpace);
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
