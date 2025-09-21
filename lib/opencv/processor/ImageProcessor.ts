import * as cv from "@techstark/opencv-js";
import Settings from "../Settings";
import { StepResult } from "../StepResult";
import ProcessingStep, {
  ProcessFunctionSuccess,
} from "./steps/ProcessingFunction";
import { imageOfPng, pngBufferOf } from "../util/ImageData";
import StepSetting from "./steps/StepSettings";
import handleOpenCvError from "../OpenCvError";
import StepName from "./steps/StepName";
import { previousDataOf } from "./PreviousData";
import HandleProcessing from "../HandleProcessing";
import ColorSpace from "../util/ColorSpace";

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

  const processStep = async (
    image: cv.Mat,
    step: ProcessingStep<any>,
    stepData: StepResult[]
  ): Promise<ProcessStepResult> => {
    try {
      const stepSettings = settingsFor(step);
      const result = await step.process(
        image,
        stepSettings,
        previousDataOf(settings, stepData)
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

  const withPreviousSteps = (stepResults: StepResult[]) => {
    stepResults.forEach((it) => stepData.push(it));
    return result;
  };

  const addSuccessResult = async (
    step: ProcessingStep<any>,
    processResult: ProcessFunctionSuccess
  ) => {
    const stepResult = {
      stepName: step.name,
      pngBuffer: await pngBufferOf(processResult.image),
      imageColorSpace: step.imageColorSpace(settings),
      contours: processResult.contours,
    };
    stepData.push(stepResult);
  };

  const process = async (pngBuffer: ArrayBuffer, colorSpace: ColorSpace) => {
    let errorMessage = undefined;
    let currentImage = await imageOfPng(pngBuffer, colorSpace);

    for (const step of processingSteps) {
      // Add a simple timeout to allow the job to be canceled
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (signal.aborted) {
        break;
      }
      const result = await processStep(currentImage, step, stepData);

      if (result.type == "success") {
        const functionResult = result.functionResult;
        currentImage.delete();
        currentImage = functionResult.image;
        await addSuccessResult(step, functionResult);
        onResult(step.name, stepData);
      } else {
        errorMessage = result.error;
        onError(errorMessage, step.name);
        break;
      }
    }
    currentImage.delete();
  };

  const result = {
    process: process,
    withPreviousSteps: withPreviousSteps,
  };

  return result;
};

export default processorOf;
