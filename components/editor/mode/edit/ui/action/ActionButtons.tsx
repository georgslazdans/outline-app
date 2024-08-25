"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import AddContour from "./contour/AddContour";
import AddPrimitive from "./AddPrimitive";
import EditContour from "./contour/EditContour";
import RemoveSelected from "../tree/action/RemoveSelected";
import AddGroup from "./group/AddGroup";
import Item from "@/lib/replicad/model/Item";
import DuplicateItem from "../tree/action/DuplicateItem";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const ActionButtons = ({ dictionary, selectedItem }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <AddPrimitive
            dictionary={dictionary}
            selectedItem={selectedItem}
          ></AddPrimitive>
          <AddContour
            dictionary={dictionary}
            selectedItem={selectedItem}
          ></AddContour>
          <AddGroup
            dictionary={dictionary}
            selectedItem={selectedItem}
          ></AddGroup>
        </div>
        <EditContour
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></EditContour>
      </div>
    </>
  );
};

export default ActionButtons;
