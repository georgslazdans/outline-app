import Settings from "../Settings";
import StepResult, { stepResultsBefore } from "../StepResult";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf, { ProcessingResult } from "./ImageProcessor";
import Steps from "./Steps";
import ProcessingStep from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";

export type ProccessStep = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  settings: Settings;
  previousData: StepResult[];
};

const processStep = async (
  command: ProccessStep
): Promise<ProcessingResult> => {
  const image = imageOf(command.imageData, command.imageColorSpace);
  const previousSteps = stepResultsBefore(
    command.stepName,
    command.previousData
  );
  const steps = stepsStartingFrom(command.stepName, command.settings);
  const result = processorOf(steps, command.settings)
    .withPreviousSteps(previousSteps)
    .process(image);
  image.delete();
  return result;
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
