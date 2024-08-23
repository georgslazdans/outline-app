"use client";

import { Dictionary } from "@/app/dictionaries";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import ModelData from "@/lib/replicad/model/ModelData";
import React from "react";
import AddContour from "./AddContour";
import AddPrimitive from "./AddPrimitive";
import EditContour from "./EditContour";
import RemoveSelected from "./RemoveSelected";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ActionButtons = ({ dictionary, modelData, setModelData }: Props) => {
  return (
    <>
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
      <EditContour dictionary={dictionary} modelData={modelData}></EditContour>
      <RemoveSelected
        dictionary={dictionary}
        modelData={modelData}
        setModelData={setModelData}
      ></RemoveSelected>
    </>
  );
};

export default ActionButtons;
