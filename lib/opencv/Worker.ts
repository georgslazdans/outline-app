import {
  ProccessStep,
  ProcessAll,
  ProcessingResult,
  processImage,
  processStep,
} from "./processor/ImageProcessor";
import * as cv from "@techstark/opencv-js";
import { OpenCvWork, OpenCvResult } from "./OpenCvWork";
import outlineCheckImageOf from "./processor/OutlineCheckImage";
import handleOpenCvError from "./OpenCvError";

const processWork = async (work: OpenCvWork) => {
  console.log("Processing work", work);
  let result: ProcessingResult;
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

const settingsOf = (message: OpenCvWork) => {
  return message.data.settings;
};

const processMessage = async (message: OpenCvWork): Promise<OpenCvResult> => {
  try {
    const stepResults = await processWork(message);
    if (!stepResults.error) {
      const outlineCheckImage = outlineCheckImageOf(
        stepResults.results!,
        settingsOf(message)
      );
      return {
        status: "success",
        result: stepResults,
        outlineCheckImage: outlineCheckImage,
      };
    } else {
      return {
        status: "failed",
        result: stepResults,
      };
    }
  } catch (e: any) {
    const errorMessage =
      "Error while executing OpenCv! " + handleOpenCvError(e);
    return {
      status: "failed",
      result: { error: errorMessage },
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
