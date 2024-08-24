"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { useState } from "react";
import ImportDialog from "../../ImportDialog";
import { ContourPoints } from "@/lib/Point";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";
import { shadowItemOf } from "@/lib/replicad/model/item/Shadow";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";

type Props = {
  dictionary: Dictionary;
};

const AddContour = ({ dictionary }: Props) => {
  const {modelData, setModelData} = useModelDataContext();
  const { setSelectedId, setInputFieldFocused } = useEditorContext();

  const [openImportDialog, setOpenImportDialog] = useState(false);

  const openContourDialog = () => {
    setInputFieldFocused(true);
    setOpenImportDialog(true);
  };

  const onContourSelect = (
    points: ContourPoints[],
    height: number,
    name: string
  ) => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const shadow = shadowItemOf(
      points,
      height,
      gridfinityHeight - height,
      name
    );
    setSelectedId(shadow.id);
    setModelData(
      forModelData(modelData).addItem(shadow),
      EditorHistoryType.OBJ_ADDED,
      shadow.id
    );
  };

  return (
    <>
      <Button onClick={openContourDialog}>
        <label>Add Contour</label>
      </Button>

      <ImportDialog
        dictionary={dictionary}
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onContourSelect={onContourSelect}
      ></ImportDialog>
    </>
  );
};

export default AddContour;
