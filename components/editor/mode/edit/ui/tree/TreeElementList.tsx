"use client";

import { Dictionary } from "@/app/dictionaries";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import React from "react";
import DraggableItem from "./DraggableItem";
import TreeElement from "./TreeElement";
import GroupedItem from "./GroupedItem";

type Props = {
  dictionary: Dictionary;
  groupedItems: GroupedItem[];
};

const TreeElementList = ({ dictionary, groupedItems }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onItemChanged = (item: Item) => {
    const updatedData = forModelData(modelData).updateItem(item);
    setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, item.id);
  };

  return (
    <>
      {groupedItems.map(({ item, groupLevel, localIndex }, index) => (
        <DraggableItem
          key={index + item.id}
          item={item}
          index={index}
          dictionary={dictionary}
        >
          <TreeElement
            dictionary={dictionary}
            item={item}
            onItemChanged={onItemChanged}
            groupLevel={groupLevel}
            index={localIndex}
          ></TreeElement>
        </DraggableItem>
      ))}
    </>
  );
};

export default TreeElementList;
