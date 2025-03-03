import * as cv from "@techstark/opencv-js";
import { ProcessStep } from "./processor/ProcessStep";
import processImage, { ProcessAll } from "./processor/ProcessAll";
import * as Comlink from "comlink";
import { processingResultHandlerFor } from "./HandleProcessing";
import { WorkerResultCallback } from "./WorkerContext";
import {
  addJob,
  createContextFor,
  doJob,
  processQueuedJob,
} from "./WorkerQueue";

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

const processOutlineImage = async (
  data: ProcessAll,
  onResult: WorkerResultCallback
) => {
  await waitForInitialization();
  await doJob(
    createContextFor((signal) => {
      const handleProcessing = processingResultHandlerFor(onResult);
      return processImage(data, handleProcessing, signal);
    })
  );
};

const processOutlineStep = async (
  data: ProcessStep,
  onResult: WorkerResultCallback
) => {
  await waitForInitialization();
  addJob(data, onResult);
  await processQueuedJob();
};

Comlink.expose({ processOutlineImage, processOutlineStep });
