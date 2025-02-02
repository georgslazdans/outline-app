import * as cv from "@techstark/opencv-js";
import processStep, { ProcessStep } from "./processor/ProcessStep";
import processImage, { ProcessAll } from "./processor/ProcessAll";
import * as Comlink from "comlink";
import { processingResultHandlerFor } from "./HandleProcessing";
import WorkerContext, { WorkerResultCallback } from "./WorkerContext";

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

let workerContext: WorkerContext | undefined = undefined;

const cancelPreviousJob = async () => {
  if (workerContext) {
    workerContext.abortController.abort();
    await workerContext.jobPromise;
  }
};

const createContextFor = (
  processingFunction: (signal: AbortSignal) => Promise<void>
): WorkerContext => {
  const abortController = new AbortController();
  const signal: AbortSignal = abortController.signal;
  const jobPromise = processingFunction(signal);
  return {
    abortController: abortController,
    jobPromise: jobPromise,
  };
};

const processOutlineImage = async (
  data: ProcessAll,
  onResult: WorkerResultCallback
) => {
  await waitForInitialization();
  await cancelPreviousJob();
  workerContext = createContextFor((signal) => {
    const handleProcessing = processingResultHandlerFor(onResult);
    return processImage(data, handleProcessing, signal);
  });
  await workerContext.jobPromise;
};

const processOutlineStep = async (
  data: ProcessStep,
  onResult: WorkerResultCallback
) => {
  await waitForInitialization();
  await cancelPreviousJob();
  workerContext = createContextFor((signal) => {
    const handleProcessing = processingResultHandlerFor(onResult);
    return processStep(data, handleProcessing, signal);
  });
  await workerContext.jobPromise;
};

Comlink.expose({ processOutlineImage, processOutlineStep });
