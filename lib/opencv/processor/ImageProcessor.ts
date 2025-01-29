import * as cv from "@techstark/opencv-js";
import Settings, { inSettings } from "../Settings";
import { StepResult } from "../StepResult";
import ProcessingStep, {
  PreviousData,
  ProcessFunctionSuccess,
} from "./steps/ProcessingFunction";
import imageDataOf, { imageOf } from "../util/ImageData";
import StepSetting from "./steps/StepSettings";
import handleOpenCvError from "../OpenCvError";
import StepName from "./steps/StepName";
import ProcessingResult from "../ProcessingResult";
import { ContourOutline } from "@/lib/data/contour/ContourPoints";

export type IntermediateImages = {
  [key in StepName]?: cv.Mat;
};

type ProcessStepResult =
  | {
      type: "success";
      functionResult: ProcessFunctionSuccess;
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
    intermediateImages: IntermediateImages,
    stepData: StepResult[]
  ): ProcessStepResult => {
    try {
      const stepSettings = settingsFor(step);
      const result = step.process(
        image,
        stepSettings,
        previousDataOf(intermediateImages, settings, stepData)
      );
      if ("errorMessage" in result) {
        return {
          type: "error",
          error: result.errorMessage,
        };
      } else {
        return {
          type: "success",
          functionResult: result,
        };
      }
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
      const result = processStep(
        currentImage,
        step,
        intermediateImages,
        stepData
      );
      if (result.type == "success") {
        const stepResult = result.functionResult;
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
  settings: Settings,
  stepData: StepResult[]
): PreviousData => {
  const handleImageSettingsFor = (stepName: StepName): StepName => {
    if (
      stepName == StepName.BLUR_OBJECT &&
      inSettings(settings).isBlurReused()
    ) {
      stepName = StepName.EXTRACT_PAPER;
    }
    if (
      stepName == StepName.BILATERAL_FILTER &&
      inSettings(settings).isBilateralFilterDisabled()
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

  const contoursOf = (stepName: StepName): ContourOutline[] | undefined => {
    return stepData.find((it) => it.stepName == stepName)?.contours;
  };

  return {
    intermediateImageOf: intermediateImageOf,
    settingsOf: settingsOf,
    contoursOf: contoursOf,
  };
};

export default processorOf;
