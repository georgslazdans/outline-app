import StepName from "@/lib/opencv/processor/steps/StepName";

export type DisplayImageInfo = {
  baseStepName: StepName;
  baseImage: ImageData;
  outlineImages: ImageData[];
};
