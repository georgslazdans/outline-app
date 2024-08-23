"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import { itemGroupOf } from "@/lib/replicad/model/item/ItemGroup";
import ItemType from "@/lib/replicad/model/ItemType";
import ModelData, { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
  selectedItem?: Item;
};

const DuplicateGroup = ({
  dictionary,
  modelData,
  setModelData,
  selectedItem,
}: Props) => {
  const { setSelectedId } = useEditorContext();

  const isGroup = () => {
    return selectedItem?.type == ItemType.Group;
  };

  const duplicateItem = (item: Item): Item => {
    if (item.type == ItemType.Group) {
      return {
        ...item,
        id: crypto.randomUUID(),
        items: item.items.map(duplicateItem),
      };
    }
    return {
      ...item,
      id: crypto.randomUUID(),
    };
  };

  const duplicateSelectedGroup = () => {
    if (selectedItem?.type == ItemType.Group) {
      const group = itemGroupOf(selectedItem.items.map(duplicateItem));
      setSelectedId(group.id);
      setModelData(
        forModelData(modelData).addItem(group),
        EditorHistoryType.GROUP_ADDED,
        group.id
      );
    }
  };

  return (
    <>
      {isGroup() && (
        <Button onClick={() => duplicateSelectedGroup()}>
          <label>Duplicate Group</label>
        </Button>
      )}
    </>
  );
};

export default DuplicateGroup;
