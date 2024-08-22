"use client";

import { Dictionary } from "@/app/dictionaries";
import { Item, ItemGroup } from "@/lib/replicad/Model";
import React, { ChangeEvent } from "react";
import TransformEdit from "./TransformEdit";

type Props = {
  dictionary: Dictionary;
  item: Item & ItemGroup;
  onItemChange: (item: Item) => void;
};

const GroupEdit = ({ dictionary, item, onItemChange }: Props) => {
  return (
    <>
      <TransformEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></TransformEdit>
    </>
  );
};

export default GroupEdit;
