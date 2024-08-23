"use client";

import { Dictionary } from "@/app/dictionaries";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import { useEditorContext } from "@/components/editor/EditorContext";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";
import EditorMode from "../../../EditorMode";
import Button from "@/components/Button";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
};

const EditContour = ({ dictionary, modelData }: Props) => {
  const { selectedId, setEditorMode } = useEditorContext();

  const isShadow = (id: string) => {
    const item = forModelData(modelData).findById(id);
    return item?.type == "shadow";
  };

  return (
    <>
      {selectedId && isShadow(selectedId) && (
        <Button
          onClick={() => setEditorMode(EditorMode.CONTOUR_EDIT)}
        >
          <label>Edit Contour</label>
        </Button>
      )}
    </>
  );
};

export default EditContour;
