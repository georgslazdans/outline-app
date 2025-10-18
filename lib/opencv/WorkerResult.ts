import StepName from "./processor/steps/StepName";
import StepResult from "./StepResult";

export type SuccessStepResult = {
  status: "step";
  step: StepResult;
};

export type ObjectOutlinesResult = {
  status: "objectOutlines";
  objectOutlineImages: ArrayBuffer[];
};

export type PaperOutlinesResult = {
  status: "paperOutlines";
  paperOutlineImages: ArrayBuffer[];
};

export type ErrorResult = {
  status: "error";
  error: string;
  stepName?: StepName;
};

type WorkerResult =
  | SuccessStepResult
  | ObjectOutlinesResult
  | PaperOutlinesResult
  | ErrorResult;

export default WorkerResult;
