"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { useState } from "react";
import ImportDialog from "../../ImportDialog";
import { ContourPoints } from "@/lib/Point";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import { shadowItemOf } from "@/lib/replicad/model/item/Shadow";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddContour = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
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
    const { addItem, getParentIdForObjectCreation: parentIdForObjectCreation } = forModelData(modelData);

    const parentId = parentIdForObjectCreation(selectedItem);
    let shadow = shadowItemOf(points, height, name);
    if (!parentId) {
      const gridfinityHeight = gridfinityHeightOf(modelData);
      shadow = {
        ...shadow,
        translation: { x: 0, y: 0, z: gridfinityHeight - height },
      };
    }

    setSelectedId(shadow.id);
    setModelData(
      addItem(shadow, parentId),
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
