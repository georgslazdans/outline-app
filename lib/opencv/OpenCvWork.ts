import { Context } from "@/context/DetailsContext";
import { ProcessAll, ProccessStep } from "./ImageProcessor";
import StepResult from "./StepResult";
import Settings, { settingsOf } from "./Settings";

export type OpenCvWork =
  | {
      type: "all";
      data: ProcessAll;
    }
  | {
      type: "step";
      data: ProccessStep;
    };

export type Status = "success" | "failed";

export type OpenCvResult = {
  status: Status;
  stepResults: StepResult[];
  outlineCheckImage: ImageData;
};

export const allWorkOf = (context: Context): OpenCvWork => {
  const imageData =
    context.imageData ||
    (typeof window !== "undefined" ? new ImageData(1, 1) : null);

  return {
    type: "all",
    data: {
      imageData: imageData,
      settings: settingsOf(context),
    },
  };
};

export const stepWorkOf = (
  stepResults: StepResult[],
  stepName: string,
  settings: Settings
): OpenCvWork => {
  const step = previousStepOf(stepResults, stepName);
  return {
    type: "step",
    data: {
      stepName: stepName,
      imageData: step.imageData,
      imageColorSpace: step.imageColorSpace,
      settings: settings,
    },
  };
};

const indexOfStep = (allSteps: StepResult[], stepName: string): number => {
  let index = 0;
  for (const step of allSteps) {
    if (step.stepName == stepName) {
      break;
    }
    index += 1;
  }
  if (index >= allSteps.length) {
    throw new Error("Index not found for step: " + stepName);
  }
  return index;
};

const previousStepOf = (allSteps: StepResult[], stepName: string) => {
  const stepIndex = indexOfStep(allSteps, stepName);
  if (stepIndex == 0) {
    return allSteps[stepIndex];
  } else {
    return allSteps[stepIndex - 1];
  }
};
