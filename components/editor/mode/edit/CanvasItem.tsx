"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useEffect, useState } from "react";
import ReplicadMesh from "../../replicad/ReplicadMesh";
import { useEditorContext } from "../../EditorContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelCache } from "../../cache/ModelCacheContext";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import TransformControls from "./ui/three/TransformControls";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
  parents?: Item[];
};

const CanvasItem = ({ dictionary, item, parents, onItemChange }: Props) => {
  const { modelData } = useModelDataContext();
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
    if (selectedId) {
      const doesItem = forModelData(modelData).doesItem;
      return (
        selectedId == item.id || doesItem(selectedId).hasChild(item.id)
      );
    }
    return false;
  };

  const enableGizmo = () => {
    const isNotGridfinity = item.type != ItemType.Gridfinity;
    return isNotGridfinity && selectedId == item.id;
  };

  const showWireframe = () => {
    if (item.type == ItemType.Gridfinity) {
      return wireframe;
    }
    return false;
  };

  const opacityOf = () => {
    if (item.type == ItemType.Gridfinity) {
      return wireframe ? 0 : 0.8;
    }
    return 1;
  };

  const colorOf = () => {
    if (item.type == ItemType.Gridfinity) {
      return "#2c7d94"; // dark-blue
    } else if (item.type == ItemType.Shadow) {
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

export default CanvasItem;
