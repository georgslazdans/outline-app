import objectOutlineImagesOf from "./processor/images/OutlineCheckImage";
import paperOutlineImagesOf from "./processor/images/PaperOutlineImages";
import StepName from "./processor/steps/StepName";
import StepResult, { findStep } from "./StepResult";
import { addToResultCache } from "./StepResultCache";
import { WorkerResultCallback } from "./WorkerContext";

export type HandleProcessingResult = (
  stepName: StepName,
  stepResults: StepResult[]
) => void;

export type HandleProcessingError = (
  errorMessage: string,
  stepName?: StepName
) => void;

type HandleProcessing = {
  onResult: HandleProcessingResult;
  onError: HandleProcessingError;
};

const handleProcessingResult = (
  onResult: WorkerResultCallback
): HandleProcessingResult => {
  return async (stepName: StepName, stepResults: StepResult[]) => {
    const stepResult = findStep(stepName).in(stepResults);
    addToResultCache(stepResult);

    if (stepName == StepName.FIND_PAPER_OUTLINE) {
      onResult({
        status: "paperOutlines",
        paperOutlineImages: await paperOutlineImagesOf(stepResults),
      });
    } else if (stepName == StepName.FIND_OBJECT_OUTLINES) {
      onResult({
        status: "objectOutlines",
        objectOutlineImages: await objectOutlineImagesOf(stepResults),
      });
    }
    onResult({
      status: "step",
      step: stepResult,
    });
  };
};

const handleProcessingError = (
  onResult: WorkerResultCallback
): HandleProcessingError => {
  return (errorMessage: string, stepName?: StepName) => {
    onResult({
      status: "error",
      error: errorMessage,
      stepName: stepName,
    });
  };
};

export const processingResultHandlerFor = (
  onResult: WorkerResultCallback
): HandleProcessing => {
  return {
    onResult: handleProcessingResult(onResult),
    onError: handleProcessingError(onResult),
  };
};

export default HandleProcessing;
