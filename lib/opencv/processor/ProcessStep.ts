import HandleProcessing from "../HandleProcessing";
import handleOpenCvError from "../OpenCvError";
import Settings from "../Settings";
import StepResult, { stepResultsBefore } from "../StepResult";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf from "./ImageProcessor";
import Steps from "./Steps";
import ProcessingStep from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";

export type ProcessStep = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  settings: Settings;
  previousData: StepResult[];
};

const processStep = async (
  command: ProcessStep,
  handleProcessing: HandleProcessing,
  signal: AbortSignal
) => {
  try {
    const image = imageOf(command.imageData, command.imageColorSpace);
    const previousSteps = stepResultsBefore(
      command.stepName,
      command.previousData
    );
    const steps = stepsStartingFrom(command.stepName, command.settings);
    processorOf(steps, command.settings, handleProcessing, signal)
      .withPreviousSteps(previousSteps)
      .process(image);
    image.delete();
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
