import HandleProcessing from "../HandleProcessing";
import handleOpenCvError from "../OpenCvError";
import Settings from "../Settings";
import { inputStepOf } from "../StepResult";
import { addToResultCache, clearCacheResults } from "../StepResultCache";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf from "./ImageProcessor";
import Steps from "./Steps";
import StepName from "./steps/StepName";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

const processImage = async (
  command: ProcessAll,
  handleProcessing: HandleProcessing,
  signal: AbortSignal
) => {
  const { settings, imageData } = command;
  try {
    clearCacheResults();
    addToResultCache({
      stepName: StepName.INPUT,
      imageData: imageData,
      imageColorSpace: ColorSpace.RGBA,
    });
    
    const image = imageOf(imageData, ColorSpace.RGBA);

    const steps = Steps.forSettings(settings);
    processorOf(steps, settings, handleProcessing, signal)
      .withPreviousSteps([inputStepOf(imageData)])
      .process(image);

    image.delete();
  } catch (e) {
    const errorMessage =
      "Error while processing all steps! " + handleOpenCvError(e);
    handleProcessing.onError(errorMessage);
  }
};

export default processImage;
