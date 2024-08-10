"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useState } from "react";
import ImportDialog from "../svg/ImportDialog";
import { ContourPoints } from "@/lib/Point";
import { shadowItemOf } from "@/lib/replicad/Model";
import { ModelData } from "@/lib/replicad/Work";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataUpdate: (modelData: ModelData) => void;
};

const EditToolbar = ({ dictionary, modelData, onModelDataUpdate }: Props) => {
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const onContourSelect = (points: ContourPoints[], height: number) => {
    const shadow = shadowItemOf(points, height);
    onModelDataUpdate({ items: [...modelData.items, shadow] });
  };

  return (
    <>
      <Button onClick={() => setOpenImportDialog(true)}>
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

export default EditToolbar;
