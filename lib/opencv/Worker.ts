import * as cv from "@techstark/opencv-js";
import outlineCheckImageOf from "./processor/images/OutlineCheckImage";
import objectThresholdCheckOf from "./processor/images/ObjectThresholdCheck";
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
import ProcessingResult from "./ProcessingResult";
import paperOutlineImagesOf from "./processor/images/ContourOptionImages";

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
  outlineCheckImage: ImageData,
  paperOutlineImages: ImageData[],
  thresholdCheck?: ImageData
): SuccessResult => {
  return {
    status: "success",
    result: stepResults,
    outlineCheckImage: outlineCheckImage,
    thresholdCheck: thresholdCheck,
    paperOutlineImages: paperOutlineImages,
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
      const outlineCheckImage = outlineCheckImageOf(
        result.data!,
        data.settings
      );
      const thresholdCheck = objectThresholdCheckOf(
        result.data!,
        data.settings
      );
      const paperOutlineImages = paperOutlineImagesOf(result.data!);
      return successMessageOf(
        result,
        outlineCheckImage,
        paperOutlineImages,
        thresholdCheck
      );
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
      const outlineCheckImage = outlineCheckImageOf(
        result.data!,
        data.settings
      );
      const thresholdCheck = objectThresholdCheckOf(
        result.data!,
        data.settings
      );
      const paperOutlineImages = paperOutlineImagesOf(result.data!);
      return successMessageOf(
        processedResult,
        outlineCheckImage,
        paperOutlineImages,
        thresholdCheck
      );
    } else {
      return failedMessageOf(result);
    }
  } catch (e) {
    return errorMessageOf(e);
  }
};

Comlink.expose({ processOutlineImage, processOutlineStep });
