import { ProccessStep, ProcessAll, processImage, processStep } from "./ImageProcessor";
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

// TODO add runtime status
addEventListener("message", async (event: MessageEvent<OpenCvWork>) => {
  cv.onRuntimeInitialized = async () => {
    const work = event.data;
    let result: StepResult[];
    switch(work.type) {
      case "all":
        result = await processImage(work.data as ProcessAll);
        break;
      case "step":
        result = await processStep(work.data as ProccessStep);
        break;
    }
    postMessage(result);
  };
});
