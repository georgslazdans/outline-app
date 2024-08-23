"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import React, { useMemo } from "react";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import { useEditorContext } from "../../EditorContext";
import EditorMode from "../EditorMode";
import EditorHistoryType from "../../history/EditorHistoryType";
import { UpdateModelData } from "../../EditorComponent";
import ItemTree from "./ui/tree/ItemTree";
import ParamsEdit from "./params/ParamsEdit";
import ItemType from "@/lib/replicad/model/ItemType";
import Gridfinity from "@/lib/replicad/model/item/Gridfinity";
import { primitiveOf } from "@/lib/replicad/model/item/Primitive";
import PrimitiveType from "@/lib/replicad/model/item/PrimitiveType";
import AddContour from "./ui/action/AddContour";
import AddPrimitive from "./ui/action/AddPrimitive";
import RemoveSelected from "./ui/action/RemoveSelected";
import EditContour from "./ui/action/EditContour";
import ActionButtons from "./ui/action/ActionButtons";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const gridfinityHeightOf = (modelData: ModelData) => {
  const magicConstant = 42;
  const item = modelData.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Gridfinity;
  const gridfinityHeight = item.params.height;
  return gridfinityHeight * magicConstant;
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
