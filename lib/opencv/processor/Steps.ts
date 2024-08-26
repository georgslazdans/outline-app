import { Mat } from "@techstark/opencv-js";
import Settings, { inSettings } from "../Settings";
import ColorSpace from "../util/ColorSpace";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import bilateralFilterStep from "./steps/BilateralFilter";
import blurStep from "./steps/Blur";
import cannyStep from "./steps/Canny";
import closeContoursStep from "./steps/CloseContours";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import grayScaleStep from "./steps/GrayScale";
import ProcessingStep, { SettingsConfig } from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";
import thresholdStep from "./steps/Threshold";

const withStepName = (
  stepName: StepName,
  processingStep: ProcessingStep<any>
): ProcessingStep<any> => {
  return { ...processingStep, name: stepName };
};

const withDisplayOverride = (
  processingStep: ProcessingStep<any>,
  displayFunction: (settings: Settings) => boolean
): ProcessingStep<any> => {
  const config = Object.entries(processingStep.config!).reduce(
    (acc, [key, config]) => {
      acc[key] = { ...config, display: displayFunction };
      return acc;
    },
    {} as SettingsConfig
  );

  return { ...processingStep, config: config };
};

const INPUT: ProcessingStep<any> = {
  name: StepName.INPUT,
  settings: {},
  imageColorSpace: () => ColorSpace.RGBA,
  process: (image: Mat) => {
    return { image: image };
  },
};

const PROCESSING_STEPS: ProcessingStep<any>[] = [
  bilateralFilterStep,
  grayScaleStep,
  blurStep,
  adaptiveThresholdStep,
  cannyStep,
  extractPaperStep,
  withStepName(StepName.GRAY_SCALE_OBJECT, grayScaleStep),
  withStepName(
    StepName.BLUR_OBJECT,
    withDisplayOverride(
      blurStep,
      (settings) => !inSettings(settings).isBlurReused()
    )
  ),
  withStepName(StepName.OBJECT_THRESHOLD, thresholdStep),
  withStepName(StepName.CANNY_OBJECT, cannyStep),
  closeContoursStep,
  extractObjectStep,
];

const getAll = () => {
  return [INPUT, ...PROCESSING_STEPS];
};

const forSettings = (settings: Settings) => {
  return PROCESSING_STEPS.filter(bilateralFilterDisabled(settings)).filter(
    blurImageReused(settings)
  );
};

const bilateralFilterDisabled = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    if (step.name != StepName.BILETERAL_FILTER) {
      return true;
    } else {
      return !inSettings(settings).isBilateralFiterDisabled();
    }
  };
};

const blurImageReused = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    const skipableSteps = [StepName.GRAY_SCALE_OBJECT, StepName.BLUR_OBJECT];
    if (!skipableSteps.includes(step.name)) {
      return true;
    } else {
      return !inSettings(settings).isBlurReused();
    }
  };
};

const mandatoryFor = (settings: Settings) => {
  const mandatorySteps = [
    StepName.INPUT,
    StepName.EXTRACT_PAPER,
    StepName.BLUR_OBJECT,
    StepName.OBJECT_THRESHOLD,
  ];
  mandatorySteps.push(extractPaperReuseStep(settings));
  return mandatorySteps;
};

const extractPaperReuseStep = (settings: Settings): StepName => {
  if (inSettings(settings).isBlurReused()) {
    return StepName.BLUR;
  } else {
    return StepName.BILETERAL_FILTER;
  }
};

const Steps = {
  forSettings,
  getAll,
  mandatoryStepsFor: mandatoryFor,
};

export default Steps;
