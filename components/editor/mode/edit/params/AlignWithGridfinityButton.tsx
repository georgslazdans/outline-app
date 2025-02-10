"use client";

import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import IconButton from "@/components/IconButton";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

type Props = {
  item: Item;
};

const ID = "align-with-gridfinity";

const UNSUPPORTED_TYPES = [ItemType.Gridfinity];

const AlignWithGridfinityButton = ({ item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const onAlign = () => {
    const { updateItem, alignWithGridfinity } = forModelData(modelData);
    setModelData(
      updateItem(alignWithGridfinity(item)),
      EditorHistoryType.OBJ_UPDATED,
      item.id
    );
  };

  if (item.type in UNSUPPORTED_TYPES) {
    return null;
  }
  return (
    <>
      <IconButton
        onClick={onAlign}
        className="p-1 w-8 h-8 rotate-180 ml-[-1rem]"
        id={ID}
      >
        <ArrowUpTrayIcon></ArrowUpTrayIcon>
      </IconButton>
      <Tooltip anchorSelect={"#" + ID}>
        Align with top of Gridfinity box
      </Tooltip>
    </>
  );
};

export default AlignWithGridfinityButton;
