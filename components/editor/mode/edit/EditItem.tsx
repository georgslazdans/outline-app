"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback, useEffect, useState } from "react";
import ReplicadMesh from "../../replicad/ReplicadMesh";
import { PivotControls } from "@react-three/drei";
import { Euler, Matrix4, Vector3 } from "three";
import { useEditorContext } from "../../EditorContext";
import Point3D, {
  add,
  addPoints,
  fromEuler,
  fromVector3,
  toEuler,
  toVector3,
} from "@/lib/Point3D";
import Item from "@/lib/replicad/Item";
import ModelType from "@/lib/replicad/ModelType";
import { useModelCache } from "../../cache/ModelCacheContext";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import TransformControls from "./ui/three/TransformControls";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
  parents?: Item[];
};

const EditItem = ({ dictionary, item, parents, onItemChange }: Props) => {
  const { wireframe, selectedId } = useEditorContext();

  const { getModel } = useModelCache();
  const [model, setModel] = useState<ReplicadResult>();

  useEffect(() => {
    const work = getModel(item);
    work.promise.then((result) => {
      setModel(result);
    });
    return () => {
      work.cancel();
    };
  }, [getModel, item]);

  const isSelected = () => {
    return selectedId == item.id;
  };

  const enableGizmo = () => {
    const isNotGridfinity = item.type != ModelType.Gridfinity;
    return isNotGridfinity && isSelected();
  };

  const showWireframe = () => {
    if (item.type == ModelType.Gridfinity) {
      return wireframe;
    }
    return false;
  };

  const opacityOf = () => {
    if (item.type == ModelType.Gridfinity) {
      return wireframe ? 0 : 0.8;
    }
    return 1;
  };

  const colorOf = () => {
    if (item.type == ModelType.Gridfinity) {
      return "#2c7d94"; // dark-blue
    } else if (item.type == ModelType.Shadow) {
      return "#1296b6";
    } else {
      return "#BDBDBD";
    }
  };

  return (
    <>
      <TransformControls
        item={item}
        enableGizmo={enableGizmo()}
        parents={parents}
        onItemChange={onItemChange}
      >
        {model && (
          <ReplicadMesh
            faces={model.faces}
            edges={model.edges}
            wireframe={showWireframe()}
            opacity={opacityOf()}
            id={item.id}
            selected={isSelected()}
            color={colorOf()}
          ></ReplicadMesh>
        )}
      </TransformControls>
    </>
  );
};

export default EditItem;
