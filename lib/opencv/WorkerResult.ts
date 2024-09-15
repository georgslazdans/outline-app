import ProcessingResult from "./ProcessingResult";

export type SuccessResult = {
  status: "success";
  result: ProcessingResult;
  outlineCheckImage: ImageData;
  thresholdCheck?: ImageData;
};
export type FailedResult = {
  status: "failed";
  result: ProcessingResult;
};

export type ErrorResult = {
  status: "error";
  error: string;
};

type WorkerResult = SuccessResult | FailedResult | ErrorResult;

export default WorkerResult;
