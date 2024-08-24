"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { primitiveOf } from "@/lib/replicad/model/item/Primitive";
import { defaultTranslationOf } from "@/lib/replicad/model/item/PrimitiveParams";
import PrimitiveType from "@/lib/replicad/model/item/PrimitiveType";
import { forModelData } from "@/lib/replicad/model/queries/ForModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const AddPrimitive = ({ dictionary, selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { setSelectedId } = useEditorContext();

  const addPrimitive = () => {
    const { addItem, getParentIdForObjectCreation: parentIdForObjectCreation } = forModelData(modelData);

    const parentId = parentIdForObjectCreation(selectedItem);
    let primitive = primitiveOf(PrimitiveType.BOX);
    if (!parentId) {
      const gridfinityHeight = gridfinityHeightOf(modelData);
      primitive = {
        ...primitive,
        translation: defaultTranslationOf(primitive.params, gridfinityHeight),
      };
    }

    setSelectedId(primitive.id);
    setModelData(
      addItem(primitive, parentId),
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
