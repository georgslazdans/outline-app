import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";

import { StepResult } from "../StepResult";
import ProcessingStep, { ProcessResult } from "./steps/ProcessingFunction";
import bilateralFilterStep from "./steps/BilateralFilter";
import grayScaleStep from "./steps/GrayScale";
import blurStep from "./steps/Blur";
import thresholdStep from "./steps/Threshold";
import extractPaperStep from "./steps/ExtractPaper";
import extractObjectStep from "./steps/ExtractObject";
import imageDataOf, { imageOf } from "../util/ImageData";
import ColorSpace from "../util/ColorSpace";
import StepSetting from "./steps/StepSettings";

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

export const PROCESSING_STEPS: ProcessingStep<any>[] = [
  bilateralFilterStep,
  grayScaleStep,
  blurStep,
  thresholdStep,
  extractPaperStep,
  extractObjectStep,
];

export type ProcessingResult = {
  results?: StepResult[];
  error?: string;
};

type ProcessStepResult =
  | {
      type: "success";
      stepResult: ProcessResult;
    }
  | {
      type: "error";
      error: string;
    };

const processorOf = (
  processingSteps: ProcessingStep<any>[],
  settings: Settings
) => {
  if (!processingSteps || processingSteps.length === 0) {
    throw new Error("No functions supplied to image processor");
  }

  const settingsFor = (step: ProcessingStep<any>): StepSetting => {
    const name = step.name;
    return settings[name];
  };

  const processStep = (
    image: cv.Mat,
    step: ProcessingStep<any>
  ): ProcessStepResult => {
    try {
      var settings = settingsFor(step);
      return {
        type: "success",
        stepResult: step.process(image, settings),
      };
    } catch (e) {
      const errorMessage = "Failed to execute step: " + step.name;
      console.error(errorMessage, e);
      return {
        type: "error",
        error: errorMessage,
      };
    }
  };

  return {
    process: (image: cv.Mat): ProcessingResult => {
      const stepData: StepResult[] = [];
      let errorMessage = undefined;
      const intermediateImages: any[] = [];
      let currentImage = image;
      for (const step of processingSteps) {
        const result = processStep(currentImage, step);
        if (result.type == "success") {
          const stepResult = result.stepResult;
          currentImage = stepResult.image;
          stepData.push({
            stepName: step.name,
            imageData: imageDataOf(currentImage),
            imageColorSpace: step.imageColorSpace,
            points: stepResult.points,
          });
          intermediateImages.push(currentImage);
        } else {
          errorMessage = result.error;
          break;
        }
      }
      intermediateImages.forEach((it) => it.delete());
      return { results: stepData, error: errorMessage };
    },
  };
};

const stepsStartingFrom = (name: string): ProcessingStep<any>[] => {
  const result = [];
  let stepFound = false;
  for (const step of PROCESSING_STEPS) {
    if (step.name == name) {
      stepFound = true;
    }
    if (stepFound) {
      result.push(step);
    }
  }
  return result;
};

export const processStep = async (
  command: ProccessStep
): Promise<ProcessingResult> => {
  const steps = stepsStartingFrom(command.stepName);
  const image = imageOf(command.imageData, command.imageColorSpace);
  const result = processorOf(steps, command.settings).process(image);
  image.delete();
  return result;
};

export const processImage = async (
  command: ProcessAll
): Promise<ProcessingResult> => {
  const image = imageOf(command.imageData, ColorSpace.RGBA);
  const steps = processorOf(PROCESSING_STEPS, command.settings).process(image);
  image.delete();
  if (steps.results) {
    ensureAllSteps(steps.results!);
  }
  return steps;
};

const ensureAllSteps = (steps: StepResult[]) => {
  const stepNames = steps.map((it) => it.stepName);
  for (const step of PROCESSING_STEPS) {
    if (!stepNames.includes(step.name)) {
      steps.push({
        stepName: step.name,
        imageData: new ImageData(1, 1),
        imageColorSpace: step.imageColorSpace,
      });
    }
  }
};
