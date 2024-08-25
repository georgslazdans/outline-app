"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React from "react";
import EditorMode from "../../../../EditorMode";
import Button from "@/components/Button";
import Item from "@/lib/replicad/model/Item";
import { Tooltip } from "react-tooltip";

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
        <Button id="edit-contour-button" onClick={() => setEditorMode(EditorMode.CONTOUR_EDIT)}>
          <label>Edit Contour</label>
          <Tooltip anchorSelect="#edit-contour-button" place="top">
            Edit Contour
          </Tooltip>
        </Button>
      )}
    </>
  );
};

export default EditContour;
