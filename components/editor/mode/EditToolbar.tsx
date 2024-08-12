"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useState } from "react";
import ImportDialog from "../svg/ImportDialog";
import { ContourPoints } from "@/lib/Point";
import { shadowItemOf } from "@/lib/replicad/Model";
import { ModelData } from "@/lib/replicad/Work";
import GridfinityEdit from "./GridfinityEdit";
import GridfinityParams from "@/lib/replicad/GridfinityParams";

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

  const gridfinityParamsOf = (modelData: ModelData): GridfinityParams => {
    return modelData.items.find((it) => it.type == "gridfinity")!.params;
  };

  const onGridfinityParamsChange = (params: GridfinityParams) => {
    const updatedItems = modelData.items.map((item) => {
      if (item.type === "gridfinity") {
        return { ...item, params };
      }
      return item;
    });
  
    onModelDataUpdate({ ...modelData, items: updatedItems });
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
      <GridfinityEdit
        dictionary={dictionary}
        params={gridfinityParamsOf(modelData)}
        onParamsChange={onGridfinityParamsChange}
      ></GridfinityEdit>
    </>
  );
};

export default EditToolbar;
