"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent } from "react";
import TransformEdit from "../TransformEdit";
import EditField from "../../../EditField";
import BooleanOperationEdit from "../BooleanOperationEdit";
import Item from "@/lib/replicad/model/Item";
import Contour from "@/lib/replicad/model/item/contour/Contour";

type Props = {
  dictionary: Dictionary;
  item: Item & Contour;
  onItemChange: (item: Item) => void;
};

const ContourEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...item, [name]: value };
      onItemChange(updatedParams);
    };
  };
  return (
    <>
      <BooleanOperationEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></BooleanOperationEdit>
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

export default ContourEdit;
