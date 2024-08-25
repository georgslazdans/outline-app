"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import ActionGroup from "../ActionGroup";
import AddContour from "./AddContour";
import AddGroup from "./AddGroup";
import AddPrimitive from "./AddPrimitive";
import Item from "@/lib/replicad/model/Item";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddButtonGroup = ({ dictionary, selectedItem }: Props) => {
  return (
    <ActionGroup dictionary={dictionary} name={"Add"}>
      <AddPrimitive
        dictionary={dictionary}
        selectedItem={selectedItem}
      ></AddPrimitive>
      <AddContour
        dictionary={dictionary}
        selectedItem={selectedItem}
      ></AddContour>
      <AddGroup dictionary={dictionary} selectedItem={selectedItem}></AddGroup>
    </ActionGroup>
  );
};

export default AddButtonGroup;
