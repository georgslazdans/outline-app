"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { primitiveOf } from "@/lib/replicad/model/item/Primitive";
import PrimitiveType from "@/lib/replicad/model/item/PrimitiveType";
import 
{ forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
};

const AddPrimitive = ({ dictionary }: Props) => {
  const {modelData, setModelData} = useModelDataContext();

  const { setSelectedId } = useEditorContext();

  // TODO add into current selected group...
  const addPrimitive = () => {
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const primitive = primitiveOf(PrimitiveType.BOX, gridfinityHeight);
    setSelectedId(primitive.id);
    setModelData(
      forModelData(modelData).addItem(primitive),
      EditorHistoryType.OBJ_ADDED,
      primitive.id
    );
  };

  return (
    <>
      <Button onClick={() => addPrimitive()}>
        <label>Add Primitive</label>
      </Button>
    </>
  );
};

export default AddPrimitive;
