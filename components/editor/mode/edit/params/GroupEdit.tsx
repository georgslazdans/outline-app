"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import TransformEdit from "./TransformEdit";
import Item from "@/lib/replicad/model/Item";
import BooleanOperationEdit from "./BooleanOperationEdit";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";

type Props = {
  dictionary: Dictionary;
  item: Item & ItemGroup;
  onItemChange: (item: Item) => void;
};

const GroupEdit = ({ dictionary, item, onItemChange }: Props) => {
  return (
    <>
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

export default GroupEdit;
