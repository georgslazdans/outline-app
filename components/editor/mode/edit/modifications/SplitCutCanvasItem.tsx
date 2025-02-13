"use client";

import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { useGridfinitySplitContext } from "../GridfinitySplitContext";
import ThreejsPlane from "./SplitCutPlane";
import { useEditorContext } from "@/components/editor/EditorContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import ItemType from "@/lib/replicad/model/ItemType";
import deepEqual from "@/lib/utils/Objects";

const SplitCutCanvasItem = () => {
  const { modelData } = useModelDataContext();
  const { selectedId } = useEditorContext();
  const { selected, highlighted } = useGridfinitySplitContext();

  const gridfinity = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  );

  const selectedObject = forModelData(modelData).findById(selectedId);
  if (
    !gridfinity ||
    !selectedObject ||
    selectedObject.type != ItemType.GridfinitySplit
  ) {
    return null;
  }

  const hasSeparateHighlight =
    highlighted && selected.find((it) => deepEqual(it, highlighted)) == null;
  return (
    <>
      {selected.map((it, index) => {
        const isSelected = deepEqual(it, highlighted);
        return (
          <ThreejsPlane
            key={"cut-plane-" + index}
            opacity={1}
            color={isSelected ? "#DA4167" : "#1296b6"}
            splitCut={it}
            gridfinityParams={gridfinity.params}
          ></ThreejsPlane>
        );
      })}
      {hasSeparateHighlight && (
        <ThreejsPlane
          key={"cut-plane-highlight"}
          opacity={1}
          color={"#DA4167"}
          splitCut={highlighted}
          gridfinityParams={gridfinity.params}
        ></ThreejsPlane>
      )}
    </>
  );
};

export default SplitCutCanvasItem;
