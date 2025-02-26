import { Mat } from "@techstark/opencv-js";
import Settings, { inSettings } from "../Settings";
import ColorSpace from "../util/ColorSpace";
import adaptiveThresholdStep from "./steps/AdaptiveThreshold";
import bilateralFilterStep from "./steps/BilateralFilter";
import blurStep from "./steps/Blur";
import cannyStep from "./steps/Canny";
import closeContoursStep from "./steps/CloseContours";
import filterObjectsStep from "./steps/FilterObjects";
import grayScaleStep from "./steps/GrayScale";
import ProcessingStep, { SettingsConfig } from "./steps/ProcessingFunction";
import StepName from "./steps/StepName";
import thresholdStep from "./steps/Threshold";
import findPaperOutlineStep from "./steps/FindPaperOutline";
import extractPaperStep from "./steps/ExtractPaper";
import findObjectOutlinesStep from "./steps/FindObjectOutlines";

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

const withDefaultSettings = (
  processingStep: ProcessingStep<any>,
  settings: any
  ): ProcessingStep<any> => {
  return { ...processingStep, settings: settings };
};

const INPUT: ProcessingStep<any> = {
  name: StepName.INPUT,
  settings: {},
  imageColorSpace: () => ColorSpace.RGBA,
  process: (image: Mat) => {
    return { image: image };
  },
};

const PROCESSING_STEPS = (): ProcessingStep<any>[] => [
  bilateralFilterStep,
  grayScaleStep,
  blurStep,
  adaptiveThresholdStep,
  cannyStep,
  withStepName(
    StepName.CLOSE_CORNERS_PAPER,
    withDefaultSettings(closeContoursStep, {
      kernelSize: 2,
      iterations: 2,
    })
  ),
  findPaperOutlineStep,
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
  findObjectOutlinesStep,
  filterObjectsStep,
];

const getAll = (): ProcessingStep<any>[] => {
  return [INPUT, ...PROCESSING_STEPS()];
};

const forSettings = (settings: Settings) => {
  return PROCESSING_STEPS()
    .filter(bilateralFilterDisabled(settings))
    .filter(blurImageReused(settings));
};

const bilateralFilterDisabled = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    if (step.name != StepName.BILATERAL_FILTER) {
      return true;
    } else {
      return !inSettings(settings).isBilateralFilterDisabled();
    }
  };
};

const blurImageReused = (settings: Settings) => {
  return (step: ProcessingStep<any>): boolean => {
    const skippableSteps = [StepName.GRAY_SCALE_OBJECT, StepName.BLUR_OBJECT];
    if (!skippableSteps.includes(step.name)) {
      return true;
    } else {
      return !inSettings(settings).isBlurReused();
    }
  };
};

const mandatoryFor = (settings: Settings) => {
  const mandatorySteps = [
    StepName.INPUT,
    StepName.FIND_PAPER_OUTLINE,
    StepName.EXTRACT_PAPER,
    StepName.BLUR_OBJECT,
    StepName.OBJECT_THRESHOLD,
    StepName.FIND_PAPER_OUTLINE,
  ];
  mandatorySteps.push(extractPaperReuseStep(settings));
  return mandatorySteps;
};

const extractPaperReuseStep = (settings: Settings): StepName => {
  if (inSettings(settings).isBlurReused()) {
    return StepName.BLUR;
  } else {
    return StepName.BILATERAL_FILTER;
  }
};

const allProcessingStepNames = (): StepName[] => {
  return getAll()
    .map((it) => it.name)
    .filter((it) => it != StepName.INPUT);
};

const allStepNamesAfter = (stepName: StepName): StepName[] => {
  const stepNames = allProcessingStepNames();
  const result: StepName[] = [];
  let isAfter = false;
  for (const name of stepNames) {
    if (name == stepName) {
      isAfter = true;
    }
    if (isAfter) {
      result.push(name);
    }
  }
  return result;
};

const isStep = (stepName: StepName) => {
  return {
    before: (otherStepName: StepName) => {
      const stepNames = allProcessingStepNames();
      for (const name of stepNames) {
        if (name == stepName) {
          return true;
        }
        if (name == otherStepName) {
          return false;
        }
      }
    },
  };
};

const Steps = {
  forSettings,
  getAll,
  mandatoryStepsFor: mandatoryFor,
  allProcessingStepNames: allProcessingStepNames,
  allStepNamesAfter: allStepNamesAfter,
  is: isStep,
};

export default Steps;
