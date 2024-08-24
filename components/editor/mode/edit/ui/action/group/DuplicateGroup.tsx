"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const DuplicateGroup = ({
  selectedItem,
}: Props) => {
  const {modelData, setModelData} = useModelDataContext();

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
      const group = duplicateItem(selectedItem);
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
