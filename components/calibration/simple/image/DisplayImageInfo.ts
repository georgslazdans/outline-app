import StepName from "@/lib/opencv/processor/steps/StepName";

export type DisplayImageInfo = {
  baseStepName: StepName;
  baseImage: ArrayBuffer;
  outlineImages: ArrayBuffer[];
};
