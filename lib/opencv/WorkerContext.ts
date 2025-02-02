import WorkerResult from "./WorkerResult";

export type WorkerResultCallback = (result: WorkerResult) => void;

type WorkerContext = {
  abortController: AbortController;
  jobPromise: Promise<void>;
};

export default WorkerContext;
