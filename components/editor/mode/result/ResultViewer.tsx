"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useEffect, useState } from "react";
import ReplicadMesh from "../../scene/ReplicadMesh";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import { useModelDataContext } from "../../ModelDataContext";
import { useModelLoadingIndicatorContext } from "../../cache/ModelLoadingIndicatorContext";
import { useErrorModal } from "@/components/error/ErrorContext";
import { useResultContext } from "./ResultContext";

type Props = {
  dictionary: Dictionary;
};

const ResultViewer = ({ dictionary }: Props) => {
  const { modelData } = useModelDataContext();
  const { setIsLoading } = useModelLoadingIndicatorContext();
  const { showError } = useErrorModal();

  const [modelResult, setModelResult] = useState<ReplicadResult>();
  const { wireframe } = useEditorContext();
  const { api } = useResultContext();

  useEffect(() => {
    setIsLoading(true);
    api?.processModelData(modelData).then(
      (result) => {
        setIsLoading(false);
        setModelResult(result as ReplicadResult);
      },
      (error) => {
        showError(error);
        setIsLoading(false);
      }
    );
  }, [api, modelData, setIsLoading, showError]);

  return (
    <>
      {modelResult &&
        modelResult.models.map((meshData, index) => {
          return (
            <ReplicadMesh
              key={index}
              faces={meshData.faces}
              edges={meshData.edges}
              wireframe={wireframe}
              opacity={1}
              color="#5a8296"
            ></ReplicadMesh>
          );
        })}
    </>
  );
};

export default ResultViewer;
