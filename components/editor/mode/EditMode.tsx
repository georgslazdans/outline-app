"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import React, { useState } from "react";
import { ReplicadResult } from "@/lib/replicad/Worker";
import { Select } from "@react-three/drei";
import ReplicadMesh from "../ReplicadMesh";
import { Vector3 } from "three";
import ModelCache from "./ModelCache";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
  wireframe: boolean;
};

const EditMode = ({
  dictionary,
  modelData,
  onModelDataChange,
  wireframe,
}: Props) => {
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

  const isGridfinity = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "gridfinity";
  };

  const handleTranslationChange = (id: string) => {
    return (translation: Vector3) => {
      const index = modelData.items.findIndex((it) => it.id === id);
      const updatedItems = [...modelData.items];
      updatedItems[index].translation = translation;
      onModelDataChange({ items: updatedItems });
    };
  };

  return (
    <>
      <ModelCache
        modelData={modelData}
        onWorkerMessage={onWorkerResult}
      ></ModelCache>
      <Select onChange={(obj) => onSelected(obj)}>
        {models.map((model) => {
          return (
            <ReplicadMesh
              key={model.id}
              faces={model.faces}
              edges={model.edges}
              enableGizmo={!isGridfinity(model.id)}
              wireframe={wireframe}
              onTranslationChange={handleTranslationChange(model.id)}
            ></ReplicadMesh>
          );
        })}
      </Select>
    </>
  );
};

export default EditMode;
