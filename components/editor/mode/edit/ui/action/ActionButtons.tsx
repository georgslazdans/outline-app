"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import Item from "@/lib/replicad/model/Item";
import AddButtonGroup from "./add/AddButtonGroup";
import EditContourGroup from "./contour/EditContourGroup";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
  className?: string;
};

const ActionButtons = ({ dictionary, selectedItem, className }: Props) => {
  return (
    <>
      <div className={"flex flex-row gap-4 " + className}>
        <AddButtonGroup
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></AddButtonGroup>

        <EditContourGroup
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></EditContourGroup>
      </div>
    </>
  );
};

export default ActionButtons;
