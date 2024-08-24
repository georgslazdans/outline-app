"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const RemoveSelected = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId, inputFieldFocused } = useEditorContext();

  const isGridfinity = () => {
    return selectedItem?.type == ItemType.Gridfinity;
  };

  const onRemoveContour = () => {
    if (!selectedItem) return;

    const updatedData = forModelData(modelData).removeById(selectedItem.id);
    setSelectedId("");
    setModelData(updatedData, EditorHistoryType.OBJ_DELETED, selectedItem.id);
  };

  return (
    <>
      {selectedItem && !isGridfinity() && (
        <Button
          onClick={onRemoveContour}
          hotkey={!inputFieldFocused ? "Delete" : ""}
        >
          <label>Remove Selected</label>
        </Button>
      )}
    </>
  );
};

export default RemoveSelected;
