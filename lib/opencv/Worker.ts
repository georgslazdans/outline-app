import {
  ProccessStep,
  ProcessAll,
  processImage,
  processStep,
} from "./processor/ImageProcessor";
import * as cv from "@techstark/opencv-js";
import StepResult from "./StepResult";
import { OpenCvWork, OpenCvResult, Status } from "./OpenCvWork";
import outlineCheckImageOf from "./processor/OutlineCheckImage";

const processWork = async (work: OpenCvWork) => {
  console.log("Processing work", work);
  let result: StepResult[];
  switch (work.type) {
    case "all":
      result = await processImage(work.data as ProcessAll);
      break;
    case "step":
      result = await processStep(work.data as ProccessStep);
      break;
  }
  return result;
};

const processMessage = async (message: OpenCvWork): Promise<OpenCvResult> => {
  try {
    const stepResults = await processWork(message);
    return {
      status: "success",
      stepResults,
      outlineCheckImage: outlineCheckImageOf(stepResults),
    };
  } catch (e) {
    console.error("Error while executing OpenCv", e);
    return {
      status: "failed",
    };
  }
};

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

addEventListener("message", async (event: MessageEvent<OpenCvWork>) => {
  await waitForInitialization();
  const work = event.data;
  const message = await processMessage(work);
  postMessage(message);
});
