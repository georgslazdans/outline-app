"use client";

import { Dictionary } from "@/app/dictionaries";
import { fullWorkOf, ModelData } from "@/lib/replicad/Work";
import React, { useState } from "react";
import { ReplicadWorker } from "../ReplicadWorker";
import SvgMesh from "../svg/SvgMesh";
import SvgSelect from "../svg/SvgSelect";
import { ReplicadResult } from "@/lib/replicad/Worker";
import ReplicadMesh from "../ReplicadMesh";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const ResultMode = ({ dictionary, modelData }: Props) => {
  const [replicadMessage, setReplicadMessage] = useState(
    fullWorkOf(modelData.items)
  );

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
        ></ReplicadMesh>
      )}
    </>
  );
};

export default ResultMode;
