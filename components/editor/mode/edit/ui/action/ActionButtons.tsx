"use client";

import { Dictionary } from "@/app/dictionaries";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import ModelData from "@/lib/replicad/model/ModelData";
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
  modelData: ModelData;
  setModelData: UpdateModelData;
  selectedItem?: Item;
};

const ActionButtons = ({
  dictionary,
  modelData,
  setModelData,
  selectedItem,
}: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <AddPrimitive
            dictionary={dictionary}
            modelData={modelData}
            setModelData={setModelData}
          ></AddPrimitive>
          <AddContour
            dictionary={dictionary}
            modelData={modelData}
            setModelData={setModelData}
          ></AddContour>
          <AddGroup
            dictionary={dictionary}
            modelData={modelData}
            setModelData={setModelData}
          ></AddGroup>
        </div>
        <DuplicateGroup
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
          selectedItem={selectedItem}
        ></DuplicateGroup>
        <EditContour
          dictionary={dictionary}
          modelData={modelData}
          selectedItem={selectedItem}
        ></EditContour>
        <RemoveSelected
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
          selectedItem={selectedItem}
        ></RemoveSelected>
      </div>
    </>
  );
};

export default ActionButtons;
