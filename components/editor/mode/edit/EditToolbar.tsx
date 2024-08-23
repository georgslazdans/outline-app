"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useMemo } from "react";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import { useEditorContext } from "../../EditorContext";
import { UpdateModelData } from "../../EditorComponent";
import ItemTree from "./ui/tree/ItemTree";
import ParamsEdit from "./params/ParamsEdit";
import ActionButtons from "./ui/action/ActionButtons";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const EditToolbar = ({ dictionary, modelData, setModelData }: Props) => {
  const { selectedId } = useEditorContext();

  const selectedItem = useMemo(() => {
    if (selectedId) {
      return forModelData(modelData).findById(selectedId);
    }
  }, [modelData, selectedId]);

  return (
    <>
      <ItemTree
        dictionary={dictionary}
        modelData={modelData}
        setModelData={setModelData}
      ></ItemTree>

      <ActionButtons
        dictionary={dictionary}
        modelData={modelData}
        setModelData={setModelData}
      ></ActionButtons>

      {selectedItem && (
        <ParamsEdit
          dictionary={dictionary}
          item={selectedItem}
          modelData={modelData}
          setModelData={setModelData}
        ></ParamsEdit>
      )}
    </>
  );
};

export default EditToolbar;
