"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import AddContour from "./contour/AddContour";
import AddPrimitive from "./AddPrimitive";
import EditContour from "./contour/EditContour";
import RemoveSelected from "./RemoveSelected";
import AddGroup from "./group/AddGroup";
import Item from "@/lib/replicad/model/Item";
import DuplicateGroup from "./group/DuplicateGroup";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const ActionButtons = ({
  dictionary,
  selectedItem,
}: Props) => {
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
        <DuplicateGroup
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></DuplicateGroup>
        <EditContour
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></EditContour>
        <RemoveSelected
          dictionary={dictionary}
          selectedItem={selectedItem}
        ></RemoveSelected>
      </div>
    </>
  );
};

export default ActionButtons;
