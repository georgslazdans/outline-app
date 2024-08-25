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
  selectedItem?: Item;
};

const duplicateDocumentSvg = (
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
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
    />
  </svg>
);

const SUPPORTED_TYPES = [ItemType.Group, ItemType.Primitive, ItemType.Shadow];
const DuplicateItem = ({ selectedItem }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { inputFieldFocused } = useEditorContext();
  const { setSelectedId } = useEditorContext();

  const canDuplicate = () => {
    if (selectedItem) {
      return SUPPORTED_TYPES.includes(selectedItem.type);
    }
  };

  const onItemDuplicate = () => {
    if (selectedItem) {
      let duplicateId;
      const data = forModelData(modelData).duplicateItem(
        selectedItem,
        (it) => (duplicateId = it.id)
      );
      setModelData(data, EditorHistoryType.OBJ_ADDED, duplicateId);
      setSelectedId(duplicateId);
    }
  };

  const id = "duplicate-item-button";
  return (
    <>
      {canDuplicate() && (
        <Button
          id={id}
          className="!w-8 !p-1"
          onClick={() => onItemDuplicate()}
          hotkey={!inputFieldFocused ? "d" : undefined}
          hotkeyCtrl={!inputFieldFocused ? true : undefined}
        >
          {duplicateDocumentSvg}
          <Tooltip anchorSelect={"#" + id} place="top">
            Duplicate (Ctrl + D)
          </Tooltip>
        </Button>
      )}
    </>
  );
};

export default DuplicateItem;
