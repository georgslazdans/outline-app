"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddGroup = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId } = useEditorContext();

  const addItemGroup = () => {
    const { addItem, getParentIdForObjectCreation: parentIdForObjectCreation } = forModelData(modelData);
    const group = itemGroupOf([]);
    setSelectedId(group.id);
    setModelData(
      addItem(group, parentIdForObjectCreation(selectedItem)),
      EditorHistoryType.GROUP_ADDED,
      group.id
    );
  };

  return (
    <>
      <Button onClick={() => addItemGroup()}>
        <label>Add Group</label>
      </Button>
    </>
  );
};

export default AddGroup;
