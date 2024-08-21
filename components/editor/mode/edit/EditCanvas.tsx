"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/ModelData";
import React, { useCallback, useEffect, useState } from "react";
import { Select } from "@react-three/drei";
import ReplicadMesh from "../../replicad/ReplicadMesh";
import { Euler, Vector3 } from "three";
import ModelCache from "../../cache/ModelCache";
import { toDegrees, toRadians } from "@/lib/utils/Math";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import { useEditorContext } from "../../EditorContext";
import EditorHistoryType from "../../EditorHistoryType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData, type: EditorHistoryType) => void;
};

export type ItemModel = {
  [id: string]: ReplicadResult;
};

const EditCanvas = ({ dictionary, modelData, onModelDataChange }: Props) => {
  const [itemModels, setItemModels] = useState<ItemModel>({});
  const { wireframe, selectedId, setSelectedId } = useEditorContext();

  const onWorkerResult = (id: string, result: ReplicadResult) => {
    const updatedModels = { ...itemModels };
    updatedModels[id] = result;
    setItemModels(updatedModels);
  };

  const onSelected = (obj: any) => {
    if (obj.length > 0) {
      const id = obj[0].userData?.id;
      if (id) {
        setSelectedId(id);
      }
    }
  };

  const isGridfinity = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "gridfinity";
  };

  const isShadow = (id: string) => {
    return modelData.items.find((it) => it.id == id)?.type == "shadow";
  };

  const positionOf = (id: string) => {
    const translation = modelData.items.find((it) => it.id == id)?.translation;
    if (translation) {
      const { x, y, z } = translation;
      const scaledPosition = new Vector3(x, y, z);
      return scaledPosition.multiplyScalar(0.01);
    }
  };

  const rotationOf = (id: string) => {
    const rotation = modelData.items.find((it) => it.id == id)?.rotation;
    if (rotation) {
      const { x, y, z } = rotation;
      return new Euler(toRadians(x), toRadians(y), toRadians(z));
    }
  };

  const handleTransformChange = useCallback(
    (id: string) => {
      return (translation: Vector3, rotation: Euler) => {
        const index = modelData.items.findIndex((it) => it.id === id);
        const updatedItems = [...modelData.items];
        const { x, y, z } = translation;
        updatedItems[index].translation = { x, y, z };
        const { x: rotX, y: rotY, z: rotZ } = rotation;
        updatedItems[index].rotation = {
          x: toDegrees(rotX),
          y: toDegrees(rotY),
          z: toDegrees(rotZ),
        };
        onModelDataChange({ items: updatedItems }, EditorHistoryType.TRANSLATION);
      };
    },
    [modelData, onModelDataChange]
  );

  const isSelected = (id: string) => {
    return selectedId == id;
  };

  useEffect(() => {
    const modelDataKeys = modelData.items.map((it) => it.id);
    const existingKeys = Object.keys(itemModels);
    const keysToDelete = existingKeys.filter(
      (key) => !modelDataKeys.includes(key)
    );

    if (keysToDelete && keysToDelete.length > 0) {
      let updatedModels = { ...itemModels };
      keysToDelete.forEach((key) => {
        delete updatedModels[key];
      });
      setItemModels(updatedModels);
    }
  }, [modelData, itemModels]);

  const showWireframe = (id: string) => {
    if (isGridfinity(id)) {
      return wireframe;
    }
    return false;
  };

  const opacityOf = (id: string) => {
    if (isGridfinity(id)) {
      return wireframe ? 0 : 0.8;
    }
    return 1;
  };

  const colorOf = (id: string) => {
    if (isGridfinity(id)) {
      return "#2c7d94"; // dark-blue
    } else if (isShadow(id)) {
      return "#1296b6";
    } else {
      return "#BDBDBD";
    }
  };

  return (
    <>
      <ModelCache
        models={itemModels}
        modelData={modelData}
        onModelData={onWorkerResult}
      ></ModelCache>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        {Object.entries(itemModels).map(([id, model]) => {
          return (
            <ReplicadMesh
              key={id}
              faces={model.faces}
              edges={model.edges}
              enableGizmo={!isGridfinity(id) && isSelected(id)}
              wireframe={showWireframe(id)}
              opacity={opacityOf(id)}
              onTransformChange={handleTransformChange(id)}
              position={positionOf(id)}
              rotation={rotationOf(id)}
              id={id}
              selected={selectedId == id}
              color={colorOf(id)}
            ></ReplicadMesh>
          );
        })}
      </Select>
    </>
  );
};

export default EditCanvas;
