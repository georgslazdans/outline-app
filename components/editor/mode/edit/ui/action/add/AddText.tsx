"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React from "react";
import ActionButton from "../../../../../ui/action/ActionButton";
import { textItemOf } from "@/lib/replicad/model/item/TextItem";
import ItemType from "@/lib/replicad/model/ItemType";
import getItemTypeIconFor from "../../icon/itemType/Icons";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddText = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { setSelectedId } = useEditorContext();

  const addPrimitive = () => {
    const { addItem, getParentIdForObjectCreation } = forModelData(modelData);

    const parentId = getParentIdForObjectCreation(selectedItem);
    let textItem = textItemOf();
    if (!parentId) {
      const gridfinityHeight = gridfinityHeightOf(modelData);
      textItem = {
        ...textItem,
        translation: { x: 0, y: 0, z: gridfinityHeight },
      };
    }

    setModelData(
      addItem(textItem, parentId),
      EditorHistoryType.OBJ_ADDED,
      textItem.id
    );
    setSelectedId(textItem.id);
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"add-text-button"}
        onClick={addPrimitive}
        icon={getItemTypeIconFor(ItemType.Text)}
        label="Text"
        tooltip="Add Text"
      ></ActionButton>
    </>
  );
};

export default AddText;
