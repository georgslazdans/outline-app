import handleOpenCvError from "./OpenCvError";
import StepName from "./processor/steps/StepName";
import StepResult from "./StepResult";

export type SuccessStepResult = {
  status: "step";
  step: StepResult;
};

export type ObjectOutlinesResult = {
  status: "objectOutlines";
  objectOutlineImages: ImageData[];
};

export type PaperOutlinesResult = {
  status: "paperOutlines";
  paperOutlineImages: ImageData[];
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
