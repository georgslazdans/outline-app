import ColorSpace from "./util/ColorSpace";
import StepName from "./processor/steps/StepName";
import { ContourOutline } from "../data/contour/ContourPoints";
import Settings, { settingsOf } from "./Settings";
import Steps from "./processor/Steps";
import ProcessingStep from "./processor/steps/ProcessingFunction";
import { Context } from "@/context/DetailsContext";

export type StepResult = {
  stepName: StepName;
  pngBuffer: ArrayBuffer;
  imageColorSpace: ColorSpace;
  contours?: ContourOutline[];
};

export const stepResultsBefore = (
  stepName: StepName,
  stepData: StepResult[]
): StepResult[] => {
  const result: StepResult[] = [];
  const allSteps = Steps.getAll().map((it) => it.name);
  for (const name of allSteps) {
    if (name == stepName) {
      break;
    }
    const data = stepData.find((it) => it.stepName == name);
    if (data) {
      result.push(data);
    }
  }
  return result;
};

export const findStep = (stepName: StepName) => {
  return {
    in: (steps: StepResult[]) => {
      return steps.find((it) => it.stepName == stepName)!;
    },
  };
};

export const placeholderSteps = (context: Context): StepResult[] => {
  const settings = settingsOf(context);
  const allSteps = Steps.getAll();
  const result = [];
  for (let i = 0; i < allSteps.length; i++) {
    result.push(emptyStepResultFor(allSteps[i], settings));
  }
  return result;
};

const emptyStepResultFor = (step: ProcessingStep<any>, settings: Settings) => {
  return {
    stepName: step.name,
    pngBuffer: new ArrayBuffer(0),
    imageColorSpace: step.imageColorSpace(settings),
  };
};

export const inputStepOf = (pngBuffer: ArrayBuffer): StepResult => {
  return {
    stepName: StepName.INPUT,
    pngBuffer: pngBuffer,
    imageColorSpace: ColorSpace.RGBA,
  };
};

export const hasImageData = (stepResult: StepResult) => {
  return stepResult.pngBuffer && stepResult.pngBuffer.byteLength > 0;
};

export default StepResult;
