import { processingResultHandlerFor } from "./HandleProcessing";
import processStep, { ProcessStep } from "./processor/ProcessStep";
import Steps from "./processor/Steps";
import WorkerContext, { WorkerResultCallback } from "./WorkerContext";

let workerContext: WorkerContext | undefined = undefined;

let nextJob: ProcessStep | undefined = undefined;
let nextOnResult: WorkerResultCallback | undefined = undefined;
let nextJobStale: boolean = true;

const cancelPreviousJob = async () => {
  if (workerContext) {
    workerContext.abortController.abort();
    await workerContext.jobPromise;
    return true;
  }
  return false;
};

const cleanUpQueue = () => {
  nextJob = undefined;
  nextOnResult = undefined;
};

const awaitPendingJobsToBeRegistered = async () => {
  while (nextJobStale) {
    nextJobStale = false;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

export const createContextFor = (
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

export const doJob = async (context: WorkerContext) => {
  await cancelPreviousJob();
  workerContext = context;
  await context.jobPromise;
  processQueue();
};

const processQueue = async () => {
  if (!nextJob) {
    workerContext = undefined;
    return;
  }
  await awaitPendingJobsToBeRegistered();
  const context = createContextFor((signal) => {
    const handleProcessing = processingResultHandlerFor(nextOnResult!);
    return processStep(nextJob!, handleProcessing, signal);
  });
  cleanUpQueue();
  doJob(context);
};

export const processQueuedJob = async () => {
  const existingJob = await cancelPreviousJob();
  if (!existingJob) {
    processQueue();
  }
};

export const addJob = (data: ProcessStep, onResult: WorkerResultCallback) => {
  if (nextJob) {
    if (Steps.is(data.stepName).before(nextJob.stepName)) {
      nextJob = data;
    } else {
      nextJob = {
        ...nextJob,
        settings: data.settings,
      };
    }
  } else {
    nextJob = data;
  }
  nextOnResult = onResult;
  nextJobStale = true;
};
