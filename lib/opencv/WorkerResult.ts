import handleOpenCvError from "./OpenCvError";
import StepResult from "./StepResult";

export type SuccessStepResult = {
  status: "step";
  step: StepResult;
};

export type ObjectOutlinesResult = {
  status: "objectOutlines";
  objectOutlineImages: ImageData[];
}

export type PaperOutlinesResult = {
  status: "paperOutlines";
  paperOutlineImages: ImageData[];
}

export type ErrorResult = {
  status: "error";
  error: string;
};

type WorkerResult = SuccessStepResult | ObjectOutlinesResult | PaperOutlinesResult | ErrorResult;

export const errorMessageOf = (e: any): ErrorResult => {
  const errorMessage = "Error while executing OpenCv! " + handleOpenCvError(e);
  return {
    status: "error",
    error: errorMessage,
  };
};


export default WorkerResult;
