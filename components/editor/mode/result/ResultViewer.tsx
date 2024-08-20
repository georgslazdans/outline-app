"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import React, { useEffect, useMemo, useState } from "react";
import ReplicadMesh from "../../ReplicadMesh";
import newWorkerInstance from "../../ReplicadWorker";
import ReplicadResult from "@/lib/replicad/WorkerResult";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  wireframe: boolean;
};

const ResultViewer = ({ dictionary, modelData, wireframe }: Props) => {
  const [modelResult, setModelResult] = useState<ReplicadResult>();

  useEffect(() => {
    const { api, worker } = newWorkerInstance();
    api.processModelData(modelData).then((result) => {
      setModelResult(result as ReplicadResult);
      worker.terminate();
    });
  }, [modelData]);

  return (
    <>
      {modelResult && (
        <ReplicadMesh
          faces={modelResult.faces}
          edges={modelResult.edges}
          enableGizmo={false}
          wireframe={wireframe}
          opacity={1}
          color="#5a8296"
        ></ReplicadMesh>
      )}
    </>
  );
};

export default ResultViewer;
