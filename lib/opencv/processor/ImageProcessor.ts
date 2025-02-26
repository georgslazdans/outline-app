import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";
import { StepResult } from "../StepResult";
import ProcessingStep, {
  ProcessFunctionSuccess,
} from "./steps/ProcessingFunction";
import imageDataOf, { imageOf } from "../util/ImageData";
import StepSetting from "./steps/StepSettings";
import handleOpenCvError from "../OpenCvError";
import StepName from "./steps/StepName";
import { previousDataOf } from "./PreviousData";
import HandleProcessing from "../HandleProcessing";

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
  settings: Settings,
  { onResult, onError }: HandleProcessing,
  signal: AbortSignal
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

  const addSuccessResult = (
    step: ProcessingStep<any>,
    processResult: ProcessFunctionSuccess
  ) => {
    const stepResult = {
      stepName: step.name,
      imageData: imageDataOf(processResult.image),
      imageColorSpace: step.imageColorSpace(settings),
      contours: processResult.contours,
    };
    stepData.push(stepResult);
    intermediateImages = {
      ...intermediateImages,
      [step.name]: processResult.image,
    };
  };

  const process = async (image: cv.Mat) => {
    let errorMessage = undefined;
    let currentImage = image;

    for (const step of processingSteps) {
      // Add a simple timeout to allow the job to be canceled
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (signal.aborted) {
        break;
      }
      const result = processStep(
        currentImage,
        step,
        intermediateImages,
        stepData
      );
      if (result.type == "success") {
        const functionResult = result.functionResult;
        currentImage = functionResult.image;
        addSuccessResult(step, functionResult);
        onResult(step.name, stepData);
      } else {
        errorMessage = result.error;
        onError(errorMessage, step.name);
        break;
      }
    }

    Object.values(intermediateImages).forEach((value) => {
      value.delete();
    });
  };

  const result = {
    process: process,
    withPreviousSteps: withPreviousSteps,
  };

  return result;
};

export default processorOf;
