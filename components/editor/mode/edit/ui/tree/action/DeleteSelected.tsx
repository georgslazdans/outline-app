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
import { TRASH_CAN_SVG } from "../../icon/GlobalIcons";

type Props = {
  dictionary: Dictionary;
  item?: Item;
};

const DeleteSelected = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const { setSelectedId, withHotkey } = useEditorContext();

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
          {...withHotkey("Delete")}
        >
          {TRASH_CAN_SVG}
          <Tooltip anchorSelect={"#" + id} place="top">
            Remove (Delete)
          </Tooltip>
        </Button>
      )}
    </>
  );
};

export default DeleteSelected;
