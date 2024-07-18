import { ProcessingResult } from "./processor/ImageProcessor";
import * as cv from "@techstark/opencv-js";
import { OpenCvWork, OpenCvResult } from "./OpenCvWork";
import outlineCheckImageOf from "./processor/OutlineCheckImage";
import handleOpenCvError from "./OpenCvError";
import processStep, { ProccessStep } from "./processor/ProcessStep";
import processImage, { ProcessAll } from "./processor/ProcessAll";
import StepResult, { stepResultsBefore } from "./StepResult";

const processWork = async (work: OpenCvWork) => {
  console.log("Processing work", work.type, work.data.settings);
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
        stepResults.data!,
        settingsOf(message)
      );
      return {
        status: "success",
        result: postProcessResult(stepResults, message),
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

const postProcessResult = (
  result: ProcessingResult,
  message: OpenCvWork
): ProcessingResult => {
  const filterPreviousSteps = (
    list: StepResult[],
    previosSteps: StepResult[]
  ): StepResult[] => {
    const previousStepNames = previosSteps.map((it) => it.stepName);
    return list.filter((it) => !previousStepNames.includes(it.stepName));
  };

  if (message.type == "step") {
    const { previousData, stepName } = message.data;
    return {
      ...result,
      data: filterPreviousSteps(
        result.data!,
        stepResultsBefore(stepName, previousData)
      ),
    };
  } else {
    return result;
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
