"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const RemoveSelected = ({ dictionary, modelData, setModelData }: Props) => {
  const { selectedId, setSelectedId, inputFieldFocused } = useEditorContext();

  const isGridfinity = (id: string) => {
    const item = forModelData(modelData).findById(id);
    return item?.type == "gridfinity";
  };
  const onRemoveContour = () => {
    if (!selectedId) return;

    const updatedData = forModelData(modelData).removeById(selectedId);
    setSelectedId("");
    setModelData(updatedData, EditorHistoryType.OBJ_DELETED, selectedId);
  };

  return (
    <>
      {selectedId && !isGridfinity(selectedId) && (
        <Button
          onClick={onRemoveContour}
          hotkey={!inputFieldFocused ? "Delete" : ""}
          className="mt-2"
        >
          <label>Remove Selected</label>
        </Button>
      )}
    </>
  );
};

export default RemoveSelected;
