"use client";

import { Dictionary } from "@/app/dictionaries";
import { ItemGroup } from "@/lib/replicad/ModelType";
import React from "react";
import TransformEdit from "./TransformEdit";
import Item from "@/lib/replicad/Item";
import BooleanOperationEdit from "./BooleanOperationEdit";

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
