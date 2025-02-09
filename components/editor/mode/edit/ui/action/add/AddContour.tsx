"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { useState } from "react";
import ContourImportDialog from "../../contour-import/ContourImportDialog";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import { contourItemOf } from "@/lib/replicad/model/item/Contour";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import getItemTypeIconFor from "../../icon/itemType/Icons";
import ActionButton from "../../../../../ui/action/ActionButton";
import { Context } from "@/context/DetailsContext";

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
    detailsContext: Context,
    contourIndex: number,
    height: number
  ) => {
    const { addItem, getParentIdForObjectCreation: parentIdForObjectCreation } =
      forModelData(modelData);

    const parentId = parentIdForObjectCreation(selectedItem);
    let item = contourItemOf(detailsContext, contourIndex, height);
    if (!parentId) {
      const gridfinityHeight = gridfinityHeightOf(modelData);
      item = {
        ...item,
        translation: { x: 0, y: 0, z: gridfinityHeight },
      };
    }

    setModelData(addItem(item, parentId), EditorHistoryType.OBJ_ADDED, item.id);
    setSelectedId(item.id);
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"add-contour-button"}
        onClick={openContourDialog}
        icon={getItemTypeIconFor(ItemType.Contour)}
        label="Contour"
        tooltip="Add Contour"
      ></ActionButton>

      <ContourImportDialog
        dictionary={dictionary}
        isOpen={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onContourSelect={onContourSelect}
      ></ContourImportDialog>
    </>
  );
};

export default AddContour;
