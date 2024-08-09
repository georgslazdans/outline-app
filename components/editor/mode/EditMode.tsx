"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData, modelWorkOf } from "@/lib/replicad/Work";
import React, { useMemo, useState } from "react";
import { ReplicadWorker } from "../ReplicadWorker";
import { ReplicadResult } from "@/lib/replicad/Worker";
import { Select } from "@react-three/drei";
import ReplicadMesh from "../ReplicadMesh";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
};

const EditMode = ({ dictionary, modelData, onModelDataChange }: Props) => {
  const replicadMessages = useMemo(
    () => modelData.items.map((item) => modelWorkOf(item)),
    [modelData]
  );

  const [models, setModels] = useState<ReplicadResult[]>([]);

  const onWorkerResult = (result: ReplicadResult) => {
    setModels((prevModels) => {
      const existingIndex = prevModels.findIndex((it) => it.id === result.id);
      if (existingIndex !== -1) {
        const updatedModels = [...prevModels];
        updatedModels[existingIndex] = result;
        return updatedModels;
      } else {
        return [...prevModels, result];
      }
    });
  };

  const onSelected = (obj: any) => {
    console.log("Selected stuff", obj);
  };

  return (
    <>
      <ReplicadWorker
        messages={replicadMessages}
        onWorkerMessage={onWorkerResult}
      ></ReplicadWorker>
      <Select onChange={(obj) => onSelected(obj)}>
        {models.map((model) => {
          return (
            <ReplicadMesh
              key={model.id}
              faces={model.faces}
              edges={model.edges}
            ></ReplicadMesh>
          );
        })}
      </Select>
    </>
  );
};

export default EditMode;
