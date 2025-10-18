import HandleProcessing from "../HandleProcessing";
import handleOpenCvError from "../OpenCvError";
import Settings from "../Settings";
import { stepResultsBefore } from "../StepResult";
import { getCacheResults } from "../StepResultCache";
import ColorSpace from "../util/ColorSpace";
import processorOf from "./ImageProcessor";
import Steps from "./Steps";
import ProcessingStep from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";

export type ProcessStep = {
  stepName: StepName;
  settings: Settings;
  pngBuffer: ArrayBuffer;
  imageColorSpace: ColorSpace;
};

const processStep = async (
  command: ProcessStep,
  handleProcessing: HandleProcessing,
  signal: AbortSignal
) => {
  try {
    const previousSteps = stepResultsBefore(
      command.stepName,
      getCacheResults()
    );
    const steps = stepsStartingFrom(command.stepName, command.settings);
    await processorOf(steps, command.settings, handleProcessing, signal)
      .withPreviousSteps(previousSteps)
      .process(command.pngBuffer, command.imageColorSpace);
  } catch (e) {
    const errorMessage = "Error while processing step! " + handleOpenCvError(e);
    handleProcessing.onError(errorMessage);
  }
};

const stepsStartingFrom = (
  name: string,
  settings: Settings
): ProcessingStep<any>[] => {
  const result = [];
  let stepFound = false;
  for (const step of Steps.forSettings(settings)) {
    if (step.name == name) {
      stepFound = true;
    }
    if (stepFound) {
      result.push(step);
    }
  }
  return result;
};

export default processStep;
