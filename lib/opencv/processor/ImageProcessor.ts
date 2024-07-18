import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";

import { StepResult } from "../StepResult";
import ProcessingStep, {
  PreviousData,
  ProcessResult,
} from "./steps/ProcessingFunction";
import imageDataOf, { imageOf } from "../util/ImageData";
import StepSetting from "./steps/StepSettings";
import handleOpenCvError from "../OpenCvError";
import StepName from "./steps/StepName";
import { ReuseStep } from "./steps/ExtractPaper";

export type IntermediateImages = {
  [key in StepName]?: cv.Mat;
};

export type ProcessingResult = {
  data?: StepResult[];
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

  const processStep = (
    image: cv.Mat,
    step: ProcessingStep<any>,
    intermediateImages: IntermediateImages
  ): ProcessStepResult => {
    try {
      const stepSettings = settingsFor(step);
      return {
        type: "success",
        stepResult: step.process(
          image,
          stepSettings,
          previousDataOf(intermediateImages, settings)
        ),
      };
    } catch (e) {
      const errorMessage =
        "Failed to execute step: " + step.name + ", " + handleOpenCvError(e);
      return {
        type: "error",
        error: errorMessage,
      };
    }
  };

  const settingsFor = (step: ProcessingStep<any>): StepSetting => {
    const name = step.name;
    const stepSettings = { ...step.settings, ...settings[name] };
    return stepSettings;
  };

  const stepData: StepResult[] = [];
  let intermediateImages: IntermediateImages = {};

  const withPreviousSteps = (stepResults: StepResult[]) => {
    intermediateImages = stepResults
      .map((it) => {
        return { [it.stepName]: imageOf(it.imageData, it.imageColorSpace) };
      })
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

    stepResults.forEach((it) => stepData.push(it));
    return result;
  };

  const process = (image: cv.Mat): ProcessingResult => {
    let errorMessage = undefined;
    let currentImage = image;

    for (const step of processingSteps) {
      const result = processStep(currentImage, step, intermediateImages);
      if (result.type == "success") {
        const stepResult = result.stepResult;
        currentImage = stepResult.image;
        stepData.push({
          stepName: step.name,
          imageData: imageDataOf(currentImage),
          imageColorSpace: step.imageColorSpace(settings),
          contours: stepResult.contours,
        });
        intermediateImages = {
          ...intermediateImages,
          [step.name]: currentImage,
        };
      } else {
        errorMessage = result.error;
        break;
      }
    }

    Object.values(intermediateImages).forEach((value) => {
      value.delete();
    });

    return { data: stepData, error: errorMessage };
  };

  const result = {
    process: process,
    withPreviousSteps: withPreviousSteps,
  };

  return result;
};

const previousDataOf = (
  intermediateImages: IntermediateImages,
  settings: Settings
): PreviousData => {
  const handleImageSettingsFor = (stepName: StepName): StepName => {
    if (
      stepName == StepName.BLUR_OBJECT &&
      settings[StepName.EXTRACT_PAPER].reuseStep == ReuseStep.BLUR
    ) {
      stepName = StepName.EXTRACT_PAPER;
    }
    if (
      (stepName == StepName.BILETERAL_FILTER) ==
      settings[StepName.BILETERAL_FILTER].disabled
    ) {
      stepName = StepName.INPUT;
    }
    return stepName;
  };
  const intermediateImageOf = (stepName: StepName) => {
    stepName = handleImageSettingsFor(stepName);
    return Object.entries(intermediateImages).findLast(
      ([key]) => key === stepName
    )![1];
  };
  const settingsOf = (stepName: StepName): StepSetting => {
    return settings[stepName];
  };
  return {
    intermediateImageOf: intermediateImageOf,
    settingsOf: settingsOf,
  };
};

export default processorOf;
