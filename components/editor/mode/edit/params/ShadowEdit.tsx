"use client";

import { Dictionary } from "@/app/dictionaries";
import { Shadow } from "@/lib/replicad/ModelType";
import React, { ChangeEvent } from "react";
import TransformEdit from "./TransformEdit";
import EditField from "../../EditField";
import BooleanOperationEdit from "./BooleanOperationEdit";
import Item from "@/lib/replicad/Item";

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
      <BooleanOperationEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></BooleanOperationEdit>
      <TransformEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></TransformEdit>
    </>
  );
};

export default ShadowEdit;
