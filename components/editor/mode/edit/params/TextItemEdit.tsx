"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent } from "react";
import TransformEdit from "./TransformEdit";
import EditField from "../../EditField";
import BooleanOperationEdit from "./BooleanOperationEdit";
import Item from "@/lib/replicad/model/Item";
import TextItem from "@/lib/replicad/model/item/TextItem";
import TextEditField from "../../TextEditField";

type Props = {
  dictionary: Dictionary;
  item: Item & TextItem;
  onItemChange: (item: Item) => void;
};

const TextItemEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...item, [name]: value };
      onItemChange(updatedParams);
    };
  };

  const handleChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...item, [name]: event.target.value };
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
      <TextEditField
        value={item.text}
        onChange={handleChange("text")}
        label={"Text"}
        name={"text"}
      ></TextEditField>
      <EditField
        value={item.fontSize}
        onChange={handleNumberChange("fontSize")}
        label={"Font Size"}
        name={"font-size"}
      ></EditField>
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

export default TextItemEdit;
