import Settings from "../Settings";
import StepResult from "../StepResult";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf, {
  PROCESSING_STEPS,
  ProcessingResult,
} from "./ImageProcessor";
import ProcessingStep from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

export type ProccessStep = {
  stepName: StepName;
  imageData: ImageData;
  imageColorSpace: ColorSpace;
  settings: Settings;
  previousData: StepResult[];
};

export const processStep = async (
  command: ProccessStep
): Promise<ProcessingResult> => {
  const steps = stepsStartingFrom(command.stepName);
  const image = imageOf(command.imageData, command.imageColorSpace);
  const result = processorOf(steps, command.settings)
    .withPreviousSteps(
      stepResultsBefore(command.stepName, command.previousData)
    )
    .process(image);
  image.delete();
  return result;
};

export const processImage = async (
  command: ProcessAll
): Promise<ProcessingResult> => {
  const image = imageOf(command.imageData, ColorSpace.RGBA);
  const steps = processorOf(PROCESSING_STEPS, command.settings).process(image);
  image.delete();
  if (steps.results) {
    ensureAllSteps(steps.results!);
  }
  return steps;
};

const stepsStartingFrom = (name: string): ProcessingStep<any>[] => {
  const result = [];
  let stepFound = false;
  for (const step of PROCESSING_STEPS) {
    if (step.name == name) {
      stepFound = true;
    }
    if (stepFound) {
      result.push(step);
    }
  }
  return result;
};

const stepResultsBefore = (
  stepName: StepName,
  stepData: StepResult[]
): StepResult[] => {
  const result: StepResult[] = [];
  for (const step of stepData) {
    if (step.stepName == stepName) {
      break;
    }
    result.push(step);
  }
  return result;
};

const ensureAllSteps = (steps: StepResult[]) => {
  const stepNames = steps.map((it) => it.stepName);
  for (const step of PROCESSING_STEPS) {
    if (!stepNames.includes(step.name)) {
      steps.push({
        stepName: step.name,
        imageData: new ImageData(1, 1),
        imageColorSpace: step.imageColorSpace,
      });
    }
  }
};
