"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
  selectedItem?: Item;
};

const RemoveSelected = ({
  dictionary,
  modelData,
  setModelData,
  selectedItem,
}: Props) => {
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
