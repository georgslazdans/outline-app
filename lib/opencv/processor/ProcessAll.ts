import HandleProcessing from "../HandleProcessing";
import handleOpenCvError from "../OpenCvError";
import Settings from "../Settings";
import { inputStepOf } from "../StepResult";
import { addToResultCache, clearCacheResults } from "../StepResultCache";
import ColorSpace from "../util/ColorSpace";
import { imageOfPng } from "../util/ImageData";
import processorOf from "./ImageProcessor";
import Steps from "./Steps";

export type ProcessAll = {
  pngBuffer: ArrayBuffer;
  settings: Settings;
};

const processImage = async (
  command: ProcessAll,
  handleProcessing: HandleProcessing,
  signal: AbortSignal
) => {
  const { settings, pngBuffer } = command;
  try {
    clearCacheResults();
    const inputStep = inputStepOf(pngBuffer);
    addToResultCache(inputStep);

    const steps = Steps.forSettings(settings);
    await processorOf(steps, settings, handleProcessing, signal)
      .withPreviousSteps([inputStep])
      .process(pngBuffer, ColorSpace.RGBA);
  } catch (e) {
    const errorMessage =
      "Error while processing all steps! " + handleOpenCvError(e);
    handleProcessing.onError(errorMessage);
  }
};

export default processImage;
