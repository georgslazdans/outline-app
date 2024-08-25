"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const SUPPORTED_TYPES = [ItemType.Group, ItemType.Primitive, ItemType.Shadow];
const DuplicateItem = ({ selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const { setSelectedId } = useEditorContext();

  const canDuplicate = () => {
    if (selectedItem) {
      return SUPPORTED_TYPES.includes(selectedItem.type);
    }
  };

  const onItemDuplicate = () => {
    if (selectedItem) {
      let duplicateId;
      const data = forModelData(modelData).duplicateItem(selectedItem, (it) =>
        duplicateId = it.id
      );
      setModelData(data, EditorHistoryType.OBJ_ADDED, duplicateId);
      setSelectedId(duplicateId)
    }
  };

  return (
    <>
      {canDuplicate() && (
        <Button className="w-32 !p-1" onClick={() => onItemDuplicate()}>
          <label>Duplicate</label>
        </Button>
      )}
    </>
  );
};

export default DuplicateItem;
