"use client";

import Item from "@/lib/replicad/model/Item";
import ModelData from "@/lib/replicad/model/ModelData";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import * as Comlink from "comlink";

export interface WorkerApi {
  processModelData: (modelData: ModelData) => Promise<ReplicadResult>;
  processItem: (item: Item) => Promise<ReplicadResult>;
  downloadBlob: (modelData: ModelData) => Promise<Blob>;
  [Comlink.releaseProxy]: () => void;
}

type Props = {
  setWorkerApiRef: (api: WorkerApi) => void;
};

export const newWorkerInstance = () => {
  const workerInstance = new Worker(
    new URL("@/lib/replicad/Worker.ts", import.meta.url)
  );
  const api = Comlink.wrap<WorkerApi>(workerInstance);
  return {api, worker: workerInstance};
};



export default newWorkerInstance;
