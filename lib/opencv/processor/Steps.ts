import { Mat } from "@techstark/opencv-js";
import Settings from "../Settings";
import ColorSpace from "../util/ColorSpace";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import bilateralFilterStep from "./steps/BilateralFilter";
import blurStep from "./steps/Blur";
import cannyStep from "./steps/Canny";
import closeContoursStep from "./steps/CloseContours";
import extractObjectStep from "./steps/ExtractObject";
import extractPaperStep from "./steps/ExtractPaper";
import grayScaleStep from "./steps/GrayScale";
import ProcessingStep from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";
import thresholdStep from "./steps/Threshold";

const withStepName = (
  stepName: StepName,
  processingStep: ProcessingStep<any>
): ProcessingStep<any> => {
  return { ...processingStep, name: stepName };
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
  withStepName(StepName.BLUR_OBJECT, blurStep),
  withStepName(StepName.OBJECT_THRESHOLD, thresholdStep),
  withStepName(StepName.CANNY_OBJECT, cannyStep),
  closeContoursStep,
  extractObjectStep,
];

const getAll = () => {
  return [INPUT, ...PROCESSING_STEPS];
};

const forSettings = (settings: Settings) => {
  return PROCESSING_STEPS.filter(bilateralFilterDisabled(settings))
    .filter(blurImageReused(settings))
    .filter(thresholdImageReused(settings));
};

const bilateralFilterDisabled = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    if (step.name != StepName.BILETERAL_FILTER) {
      return true;
    } else {
      return settings[StepName.BILETERAL_FILTER].disabled == false;
    }
  };
};

const blurImageReused = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    const skipableSteps = [StepName.GRAY_SCALE_OBJECT, StepName.BLUR_OBJECT];
    if (!skipableSteps.includes(step.name)) {
      return true;
    } else {
      const reusedValues = [StepName.ADAPTIVE_THRESHOLD, StepName.BLUR];
      return !reusedValues.includes(settings[StepName.EXTRACT_PAPER].reuseStep);
    }
  };
};

const thresholdImageReused = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    const skipableSteps = [
      StepName.GRAY_SCALE_OBJECT,
      StepName.BLUR_OBJECT,
      StepName.OBJECT_THRESHOLD,
    ];
    if (!skipableSteps.includes(step.name)) {
      return true;
    } else {
      return (
        settings[StepName.EXTRACT_PAPER].reuseStep !=
        StepName.ADAPTIVE_THRESHOLD
      );
    }
  };
};

const mandatoryFor = (settings: Settings) => {
  const mandatorySteps = [
    StepName.INPUT,
    StepName.EXTRACT_PAPER,
    StepName.BLUR_OBJECT,
  ];
  mandatorySteps.push(extractPaperReuseStep(settings));
  return mandatorySteps;
};

const extractPaperReuseStep = (settings: Settings): StepName => {
  if (settings[StepName.EXTRACT_PAPER].reuseStep == "none") {
    return StepName.BILETERAL_FILTER;
  } else {
    return StepName.BLUR;
  }
};

const debugSettings = (settings: Settings) => {
  const result = forSettings(settings);
  console.log("Result for settings", result);
  return result;
};

const Steps = {
  forSettings: debugSettings,
  getAll,
  mandatoryStepsFor: mandatoryFor,
};

export default Steps;
