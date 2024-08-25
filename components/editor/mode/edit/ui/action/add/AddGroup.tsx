"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React from "react";
import { Tooltip } from "react-tooltip";
import ItemType from "@/lib/replicad/model/ItemType";
import getItemTypeIconFor from "../../icon/itemType/Icons";
import ActionButton from "../ActionButton";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddGroup = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId } = useEditorContext();

  const addItemGroup = () => {
    const { addItem, getParentIdForObjectCreation: parentIdForObjectCreation } =
      forModelData(modelData);
    const group = itemGroupOf([]);
    setModelData(
      addItem(group, parentIdForObjectCreation(selectedItem)),
      EditorHistoryType.GROUP_ADDED,
      group.id
    );
    setSelectedId(group.id);
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"add-group-button"}
        onClick={addItemGroup}
        icon={getItemTypeIconFor(ItemType.Group)}
        label="Group"
        tooltip="Add Group"
      ></ActionButton>
    </>
  );
};

export default AddGroup;
