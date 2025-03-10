"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import React from "react";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import Item from "@/lib/replicad/model/Item";
import Gridfinity from "@/lib/replicad/model/item/gridfinity/Gridfinity";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useEditorContext } from "@/components/editor/EditorContext";
import { emptySplitModification } from "@/lib/replicad/model/item/gridfinity/SplitModification";

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

type Props = {
  dictionary: Dictionary;
  item: Item & Gridfinity;
};

const SplitGridfinityBox = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId } = useEditorContext();
  const onSplitGridfinity = () => {
    const { updateItem } = forModelData(modelData);
    const splitModification = emptySplitModification();
    const modifications = item.modifications ? item.modifications : [];
    const updatedItem = {
      ...item,
      modifications: [...modifications, splitModification],
    };
    setModelData(
      updateItem(updatedItem),
      EditorHistoryType.OBJ_UPDATED,
      item?.id
    );
    setSelectedId(splitModification.id);
  };

  return (
    <>
      <ActionButton
        dictionary={dictionary}
        id={"split-gridfinity"}
        onClick={onSplitGridfinity}
        icon={icon}
        label="Split"
        tooltip="Split Gridfinity box"
        // {...withHotkey("Delete")}
      ></ActionButton>
    </>
  );
};

export default SplitGridfinityBox;
