"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { useState } from "react";
import ContourImportDialog from "../../contour-import/ContourImportDialog";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/gridfinity/Gridfinity";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import { contourItemFromContext } from "@/lib/replicad/model/item/contour/Contour";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import getItemTypeIconFor from "../../icon/itemType/Icons";
import ActionButton from "../../../../../ui/action/ActionButton";
import { Context } from "@/context/DetailsContext";
import { useUserPreference } from "@/lib/preferences/useUserPreference";
import UserPreference from "@/lib/preferences/UserPreference";
import { modifyContourList } from "@/lib/data/contour/ContourPoints";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddContour = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId, setInputFieldFocused } = useEditorContext();

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const { value: autoScale } = useUserPreference(
    UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT
  );
  const { value: autoScaleValue } = useUserPreference(
    UserPreference.AUTO_SCALE_ALONG_NORMALS_ON_CONTOUR_IMPORT_VALUE
  );

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
    let item = contourItemFromContext(detailsContext, contourIndex, height);
    if (!parentId) {
      const gridfinityHeight = gridfinityHeightOf(modelData);
      item = {
        ...item,
        translation: { x: 0, y: 0, z: gridfinityHeight },
      };
    }
    if (autoScale) {
      item = {
        ...item,
        points: modifyContourList(item.points).scaleAlongNormal(
          autoScaleValue as number
        ),
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
