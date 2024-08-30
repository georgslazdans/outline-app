"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useEffect, useState } from "react";
import ReplicadMesh from "../../scene/ReplicadMesh";
import newWorkerInstance from "../../ReplicadWorker";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import { useModelDataContext } from "../../ModelDataContext";
import { useModelLoadingIndicatorContext } from "../../cache/ModelLoadingIndicatorContext";

type Props = {
  dictionary: Dictionary;
};

const ResultViewer = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();
  const { setIsLoading } = useModelLoadingIndicatorContext();

  const [modelResult, setModelResult] = useState<ReplicadResult>();
  const { wireframe } = useEditorContext();

  useEffect(() => {
    setIsLoading(true);
    const { api, worker } = newWorkerInstance();
    api.processModelData(modelData).then(
      (result) => {
        setIsLoading(false);
        setModelResult(result as ReplicadResult);
        worker.terminate();
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
  }, [modelData, setIsLoading]);

  return (
    <>
      {modelResult && (
        <ReplicadMesh
          faces={modelResult.faces}
          edges={modelResult.edges}
          wireframe={wireframe}
          opacity={1}
          color="#5a8296"
        ></ReplicadMesh>
      )}
    </>
  );
};

export default ResultViewer;
