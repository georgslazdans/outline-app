"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import React, { useCallback, useEffect, useState } from "react";
import { ReplicadResultProps } from "@/lib/replicad/Worker";
import { Select } from "@react-three/drei";
import ReplicadMesh from "../../ReplicadMesh";
import { Euler, Vector3 } from "three";
import ModelCache from "../ModelCache";
import { toDegrees, toRadians } from "@/lib/utils/Math";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
  wireframe: boolean;
  onModelIdSelect: (id: string) => void;
  selectedId?: string;
};

const EditCanvas = ({
  dictionary,
  modelData,
  onModelDataChange,
  wireframe,
  onModelIdSelect,
  selectedId,
}: Props) => {
  const [models, setModels] = useState<ReplicadResultProps[]>([]);

  const onWorkerResult = (result: ReplicadResultProps) => {
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
    if (obj.length > 0) {
      const id = obj[0].userData?.id;
      if (id) {
        onModelIdSelect(id);
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
        onModelDataChange({ items: updatedItems });
      };
    },
    [modelData, onModelDataChange]
  );

  const isSelected = (id: string) => {
    return selectedId == id;
  };

  useEffect(() => {
    const updatedModels = models.filter((model) =>
      modelData.items.some((item) => item.id === model.id)
    );
    if (models.length != updatedModels.length) {
      setModels(updatedModels);
    }
  }, [modelData, models]);

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
        modelData={modelData}
        onWorkerMessage={(result) =>
          onWorkerResult(result as ReplicadResultProps)
        }
      ></ModelCache>
      <Select onChangePointerUp={(obj) => onSelected(obj)}>
        {models.map((model) => {
          return (
            <ReplicadMesh
              key={model.id}
              faces={model.faces}
              edges={model.edges}
              enableGizmo={!isGridfinity(model.id) && isSelected(model.id)}
              wireframe={showWireframe(model.id)}
              opacity={opacityOf(model.id)}
              onTransformChange={handleTransformChange(model.id)}
              position={positionOf(model.id)}
              rotation={rotationOf(model.id)}
              id={model.id}
              selected={selectedId == model.id}
              color={colorOf(model.id)}
            ></ReplicadMesh>
          );
        })}
      </Select>
    </>
  );
};

export default EditCanvas;
