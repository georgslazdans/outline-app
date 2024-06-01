import {
  ProccessStep,
  ProcessAll,
  processImage,
  processStep,
} from "./ImageProcessor";
import * as cv from "@techstark/opencv-js";
import StepResult from "./StepResult";

export type OpenCvWork =
  | {
      type: "all";
      data: ProcessAll;
    }
  | {
      type: "step";
      data: ProccessStep;
    };

type Status = "success" | "failed";

export type OpenCvResult = {
  status: Status;
  stepResults: StepResult[];
};

const processWork = async (work: OpenCvWork) => {
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

addEventListener("message", async (event: MessageEvent<OpenCvWork>) => {
  // Shouldn't we (who the fuck are we?) initialize the opencv runtime and keep it for next steps?
  // @ts-ignore
  cv.onRuntimeInitialized = async () => {
    const work = event.data;
    let status: Status = "success";
    let stepResults: StepResult[] = [];
    try {
      stepResults = await processWork(work);
    } catch (e) {
      status = "failed";
      console.error("Error while executing OpenCv", e);
    }
    const message: OpenCvResult = {
      stepResults,
      status,
    };
    postMessage(message);
  };
});
