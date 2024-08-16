"use client";

import { Dictionary } from "@/app/dictionaries";
import { fullWorkOf, ModelData, ReplicadWork } from "@/lib/replicad/Work";
import React, { useEffect, useMemo, useState } from "react";
import { ReplicadWorker } from "../../ReplicadWorker";
import { ReplicadResult, ReplicadResultProps } from "@/lib/replicad/Worker";
import ReplicadMesh from "../../ReplicadMesh";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  wireframe: boolean;
};

const ResultViewer = ({ dictionary, modelData, wireframe }: Props) => {
  const [replicadMessage, setReplicadMessage] = useState<ReplicadWork>();

  useEffect(() => {
    setReplicadMessage(fullWorkOf(modelData.items));
  }, [modelData]);

  const [modelResult, setModelResult] = useState<ReplicadResultProps>();

  const asMessageArray = () => {
    return replicadMessage ? [replicadMessage] : [];
  };

  const onWorkerMessage = (result: ReplicadResult) => {
    setModelResult(result as ReplicadResultProps);
    setReplicadMessage(undefined);
  };

  return (
    <>
      <ReplicadWorker
        messages={asMessageArray()}
        onWorkerMessage={onWorkerMessage}
      ></ReplicadWorker>
      {modelResult && (
        <ReplicadMesh
          key={modelResult.id}
          faces={modelResult.faces}
          edges={modelResult.edges}
          enableGizmo={false}
          wireframe={wireframe}
        ></ReplicadMesh>
      )}
    </>
  );
};

export default ResultViewer;
