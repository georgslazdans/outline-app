import Settings from "../Settings";
import StepResult from "../StepResult";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf, { ProcessingResult } from "./ImageProcessor";
import Steps from "./Steps";
import StepName from "./steps/StepName";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

const processImage = async (command: ProcessAll): Promise<ProcessingResult> => {
  const { settings, imageData } = command;
  const image = imageOf(imageData, ColorSpace.RGBA);
  const steps = Steps.forSettings(settings);
  let result = processorOf(steps, settings)
    .withPreviousSteps([inputStepOf(imageData)])
    .process(image);
  image.delete();
  if (result.data) {
    result = {
      ...result,
      data: ensureAllSteps(result.data!, settings),
    };
  }
  return result;
};

const inputStepOf = (image: ImageData): StepResult => {
  return {
    stepName: StepName.INPUT,
    imageData: image,
    imageColorSpace: ColorSpace.RGBA,
  };
};

const ensureAllSteps = (
  steps: StepResult[],
  settings: Settings
): StepResult[] => {
  const allSteps = Steps.getAll();
  const result = [];
  const stepNames = steps.map((it) => it.stepName);
  for (let i = 0; i < allSteps.length; i++) {
    const step = allSteps[i];
    if (!stepNames.includes(step.name)) {
      result.push({
        stepName: step.name,
        imageData: new ImageData(1, 1),
        imageColorSpace: step.imageColorSpace(settings),
      });
    } else {
      result.push(steps.find((it) => it.stepName == step.name)!);
    }
  }
  return result;
};

export default processImage;
