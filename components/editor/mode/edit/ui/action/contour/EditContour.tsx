"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React from "react";
import EditorMode from "../../../../EditorMode";
import Button from "@/components/Button";
import Item from "@/lib/replicad/model/Item";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const EditContour = ({ dictionary, selectedItem }: Props) => {
  const { setEditorMode } = useEditorContext();

  const isShadow = () => {
    return selectedItem?.type == "shadow";
  };

  return (
    <>
      {selectedItem && isShadow() && (
        <Button onClick={() => setEditorMode(EditorMode.CONTOUR_EDIT)}>
          <label>Edit Contour</label>
        </Button>
      )}
    </>
  );
};

export default EditContour;
