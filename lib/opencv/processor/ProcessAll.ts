import HandleProcessing from "../HandleProcessing";
import handleOpenCvError from "../OpenCvError";
import Settings from "../Settings";
import { inputStepOf } from "../StepResult";
import ColorSpace from "../util/ColorSpace";
import { imageOf } from "../util/ImageData";
import processorOf from "./ImageProcessor";
import Steps from "./Steps";

export type ProcessAll = {
  imageData: ImageData;
  settings: Settings;
};

const processImage = async (
  command: ProcessAll,
  handleProcessing: HandleProcessing,
  signal: AbortSignal
) => {
  try {
    const { settings, imageData } = command;
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
