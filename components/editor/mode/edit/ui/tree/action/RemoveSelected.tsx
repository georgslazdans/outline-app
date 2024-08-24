"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  item?: Item;
};

const RemoveSelected = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId, inputFieldFocused } = useEditorContext();

  const isGridfinity = () => {
    return item?.type == ItemType.Gridfinity;
  };

  const onRemoveContour = () => {
    if (!item) return;

    const updatedData = forModelData(modelData).removeById(item.id);
    setSelectedId("");
    setModelData(updatedData, EditorHistoryType.OBJ_DELETED, item.id);
  };

  return (
    <>
      {item && !isGridfinity() && (
        <Button
          className="w-32 !p-1"
          onClick={onRemoveContour}
          hotkey={!inputFieldFocused ? "Delete" : ""}
        >
          <label>Remove</label>
        </Button>
      )}
    </>
  );
};

export default RemoveSelected;
