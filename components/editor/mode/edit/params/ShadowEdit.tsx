"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { Item, Shadow } from "@/lib/replicad/ModelType";
import React, { ChangeEvent } from "react";
import TransformEdit from "./TransformEdit";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditField from "../../EditField";

type Props = {
  dictionary: Dictionary;
  item: Item & Shadow;
  onItemChange: (item: Item) => void;
};

const ShadowEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...item, [name]: value };
      onItemChange(updatedParams);
    };
  };
  return (
    <>
      <EditField
        value={item.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
      ></EditField>
      <TransformEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></TransformEdit>
    </>
  );
};

export default ShadowEdit;
