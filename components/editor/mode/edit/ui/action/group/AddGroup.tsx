"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const AddGroup = ({ dictionary, modelData, setModelData }: Props) => {
  const { setSelectedId } = useEditorContext();

  const addItemGroup = () => {
    const group = itemGroupOf([]);
    setSelectedId(group.id);
    setModelData(
      forModelData(modelData).addItem(group),
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
