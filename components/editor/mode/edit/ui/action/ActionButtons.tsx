"use client";

import { Dictionary } from "@/app/dictionaries";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import ModelData from "@/lib/replicad/model/ModelData";
import React from "react";
import AddContour from "./AddContour";
import AddPrimitive from "./AddPrimitive";
import EditContour from "./EditContour";
import RemoveSelected from "./RemoveSelected";
import AddGroup from "./AddGroup";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ActionButtons = ({ dictionary, modelData, setModelData }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2">
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
        <EditContour
          dictionary={dictionary}
          modelData={modelData}
        ></EditContour>
        <RemoveSelected
          dictionary={dictionary}
          modelData={modelData}
          setModelData={setModelData}
        ></RemoveSelected>
      </div>
    </>
  );
};

export default ActionButtons;
