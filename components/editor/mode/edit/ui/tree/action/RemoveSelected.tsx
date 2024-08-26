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
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
  item?: Item;
};

const trashCanSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const RemoveSelected = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId, inputFieldFocused } = useEditorContext();

  const isGridfinity = () => {
    return item?.type == ItemType.Gridfinity;
  };

  const onRemoveItem = () => {
    if (!item) return;
    const { deleteById: removeById } = forModelData(modelData);
    setSelectedId("");
    setModelData(removeById(item.id), EditorHistoryType.OBJ_DELETED, item.id);
  };

  const id = "remove-selected-button";
  return (
    <>
      {item && !isGridfinity() && (
        <Button
          id={id}
          className="!w-8 !p-1 !text-red"
          onClick={onRemoveItem}
          hotkey={!inputFieldFocused ? "Delete" : ""}
        >
          {trashCanSvg}
          <Tooltip anchorSelect={"#" + id} place="top">
            Remove (Delete)
          </Tooltip>
        </Button>
      )}
    </>
  );
};

export default RemoveSelected;
