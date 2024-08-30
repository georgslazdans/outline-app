"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { memo, useEffect, useState } from "react";
import ReplicadMesh from "../../scene/ReplicadMesh";
import { useEditorContext } from "../../EditorContext";
import Item, { modelKeyOf } from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { useModelCache } from "../../cache/ModelCacheContext";
import ReplicadResult from "@/lib/replicad/WorkerResult";
import TransformControls from "./ui/three/TransformControls";
import { useModelDataContext } from "../../ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
  parents?: Item[];
};

const CanvasItem = memo(function CanvasItem({
  dictionary,
  item,
  parents,
  onItemChange,
}: Props) {
  const { modelData } = useModelDataContext();
  const { wireframe, selectedId } = useEditorContext();
  const { getModel } = useModelCache();
  const [model, setModel] = useState<ReplicadResult>();
  const [modelKey, setModelKey] = useState<string>();

  useEffect(() => {
    const key = modelKeyOf(item);
    if (modelKey != key) {
      const work = getModel(item);
      work.promise.then((result) => {
        setModel(result);
        setModelKey(key);
      });
      return () => {
        work.cancel();
      };
    }
  }, [getModel, item, modelKey]);

  const isSelected = () => {
    if (selectedId) {
      const { doesItem } = forModelData(modelData);
      return selectedId == item.id || doesItem(selectedId).hasChild(item.id);
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
    } else if (item.type == ItemType.Contour) {
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
});

export default CanvasItem;
