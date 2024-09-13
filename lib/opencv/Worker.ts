import { ProcessingResult } from "./processor/ImageProcessor";
import * as cv from "@techstark/opencv-js";
import outlineCheckImageOf from "./processor/OutlineCheckImage";
import objectThresholdCheckOf from "./processor/ObjectThresholdCheck";
import handleOpenCvError from "./OpenCvError";
import processStep, { ProcessStep } from "./processor/ProcessStep";
import processImage, { ProcessAll } from "./processor/ProcessAll";
import StepResult, { stepResultsBefore } from "./StepResult";
import Settings from "./Settings";
import * as Comlink from "comlink";
import WorkerResult, {
  ErrorResult,
  FailedResult,
  SuccessResult,
} from "./WorkerResult";

let initialized = false;

const initializedPromise = new Promise<void>((resolve) => {
  if (initialized) {
    resolve();
  } else {
    // @ts-ignore
    cv.onRuntimeInitialized = () => {
      initialized = true;
      resolve();
    };
  }
});

const waitForInitialization = async () => {
  await initializedPromise;
};

const successMessageOf = (
  stepResults: ProcessingResult,
  settings: Settings
): SuccessResult => {
  const outlineCheckImage = outlineCheckImageOf(stepResults.data!, settings);
  const thresholdCheck = objectThresholdCheckOf(stepResults.data!, settings);
  return {
    status: "success",
    result: stepResults,
    outlineCheckImage: outlineCheckImage,
    thresholdCheck: thresholdCheck,
  };
};

const errorMessageOf = (e: any): ErrorResult => {
  const errorMessage = "Error while executing OpenCv! " + handleOpenCvError(e);
  return {
    status: "error",
    error: errorMessage,
  };
};

const failedMessageOf = (stepResults: ProcessingResult): FailedResult => {
  return {
    status: "failed",
    result: stepResults,
  };
};

const processOutlineImage = async (data: ProcessAll): Promise<WorkerResult> => {
  await waitForInitialization();
  try {
    const result = await processImage(data);
    if (!result.error) {
      return successMessageOf(result, data.settings);
    } else {
      return failedMessageOf(result);
    }
  } catch (e) {
    return errorMessageOf(e);
  }
};

const filterPreviousSteps = (
  list: StepResult[],
  previousSteps: StepResult[]
): StepResult[] => {
  const previousStepNames = previousSteps.map((it) => it.stepName);
  return list.filter((it) => !previousStepNames.includes(it.stepName));
};

const postProcessResult = (
  result: ProcessingResult,
  data: ProcessStep
): ProcessingResult => {
  const { previousData, stepName } = data;
  return {
    ...result,
    data: filterPreviousSteps(
      result.data!,
      stepResultsBefore(stepName, previousData)
    ),
  };
};

const processOutlineStep = async (data: ProcessStep): Promise<WorkerResult> => {
  await waitForInitialization();
  try {
    const result = await processStep(data);
    if (!result.error) {
      const processedResult = postProcessResult(result, data);
      return successMessageOf(processedResult, data.settings);
    } else {
      return failedMessageOf(result);
    }
  } catch (e) {
    return errorMessageOf(e);
  }
};

Comlink.expose({ processOutlineImage, processOutlineStep });
