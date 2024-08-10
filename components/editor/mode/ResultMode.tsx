"use client";

import { Dictionary } from "@/app/dictionaries";
import { fullWorkOf, ModelData } from "@/lib/replicad/Work";
import React, { useState } from "react";
import { ReplicadWorker } from "../ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import ReplicadMesh from "../ReplicadMesh";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  wireframe: boolean;
};

const ResultMode = ({ dictionary, modelData, wireframe }: Props) => {
  const replicadMessage = fullWorkOf(modelData.items);

  const [modelResult, setModelResult] = useState<ReplicadResult>();

  return (
    <>
      <ReplicadWorker
        messages={[replicadMessage]}
        onWorkerMessage={setModelResult}
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

export default ResultMode;
