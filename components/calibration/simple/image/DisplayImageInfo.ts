import StepName from "@/lib/opencv/processor/steps/StepName";
import ContourPoints from "@/lib/data/contour/ContourPoints";

export type DisplayImageInfo = {
  baseStepName: StepName;
  baseImage: ArrayBuffer;
  outlineImages: ArrayBuffer[];
  outlinePoints: ContourPoints[];
};
