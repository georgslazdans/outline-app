export type OutlineResult = {
  imageData: ImageData;
  svg: string;
  intermediateData: IntermediateData[];
};

export type IntermediateData = {
  imageData: ImageData;
  stepName: string;
};

export default OutlineResult;