import * as cv from "@techstark/opencv-js";
import Settings from "./Settings";

import { StepResult } from "./StepResult";
import ProcessingStep, {
  ProcessResult,
  StepSetting,
} from "./steps/ProcessingFunction";
import bilateralFilterStep from "./steps/BilateralFilter";
import grayScaleStep from "./steps/GrayScale";
import blurStep from "./steps/Blur";
import thresholdStep from "./steps/Threshold";
import extractPaperStep from "./steps/ExtractPaper";
import extractObjectStep from "./steps/ExtractObject";
import imageDataOf, { imageOf } from "./ImageData";
import ColorSpace from "./ColorSpace";

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

export const processingSteps: ProcessingStep<any>[] = [
  bilateralFilterStep,
  grayScaleStep,
  blurStep,
  thresholdStep,
  extractPaperStep,
  extractObjectStep,
];

const processorOf = (
  processingSteps: ProcessingStep<any>[],
  settings: Settings
) => {
  if (!processingSteps || processingSteps.length === 0) {
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
  ): ProcessResult => {
    try {
      var settings = settingsFor(processingFunction);
      return processingFunction.process(image, settings);
    } catch (e) {
      console.error("Failed to execute step: " + processingFunction.name, e);
      // Rerun with default settings!
      return processingFunction.process(image, processingFunction.settings);
      // throw new Error("Failed to execute step: " + processingFunction.name);
    }
  };

  return {
    process: (image: cv.Mat): StepResult[] => {
      const stepData: StepResult[] = [];
      const intermediateImages: any[] = [];
      let currentImage = image;
      for (const step of processingSteps) {
        const result = processStep(currentImage, step);
        currentImage = result.image;
        stepData.push({
          stepName: step.name,
          imageData: imageDataOf(result.image),
          imageColorSpace: step.imageColorSpace,
          points: result.points,
        });
        intermediateImages.push(currentImage);
      }
      intermediateImages.forEach((it) => it.delete());
      return stepData;
    },
  };
};

const stepsStartingFrom = (name: string): ProcessingStep<any>[] => {
  const result = [];
  let stepFound = false;
  for(const step of processingSteps) {
    if(step.name == name) {
      stepFound = true;
    }
    if(stepFound) {
      result.push(step);
    }
  }
  return result;
};

export const processStep = async (
  command: ProccessStep
): Promise<StepResult[]> => {
  const steps = stepsStartingFrom(command.stepName);
  const image = imageOf(command.imageData, command.imageColorSpace);
  const result = processorOf(steps, command.settings).process(image);
  image.delete();
  return result;
};

export const processImage = async (
  command: ProcessAll
): Promise<StepResult[]> => {
  const image = imageOf(command.imageData, ColorSpace.RGBA);
  const steps = processorOf(processingSteps, command.settings).process(
    image
  );
  image.delete();
  return steps;
};
