"use client";

import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import IconButton from "@/components/IconButton";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import Item from "@/lib/replicad/model/Item";
import { gridfinityHeightOf } from "@/lib/replicad/model/item/Gridfinity";
import { defaultHeightOf } from "@/lib/replicad/model/item/PrimitiveParams";
import ItemType from "@/lib/replicad/model/ItemType";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";

type Props = {
  item: Item;
};

const ID = "align-with-gridfinity";

const UNSUPPORTED_TYPES = [ItemType.Gridfinity];

const AlignWithGridfinity = ({ item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();

  const alignItem = (item: Item, offset: number): Item => {
    if (item.type == ItemType.Group) {
      // TODO for each child, align to gridfinity?
      return {
        ...item,
        translation: { ...item.translation!, z: offset },
        items: item.items.map((it) => alignItem(it, 0)),
      };
    } else {
      let height =
        item.type == ItemType.Primitive
          ? offset + defaultHeightOf(item.params)
          : offset;
      return {
        ...item,
        translation: { ...item.translation!, z: height },
      };
    }
  };

  const getParentHeight = (id: string): number => {
    const { findParentId, findById } = forModelData(modelData);
    const parentId = findParentId(id);
    if (parentId) {
      const parent = findById(parentId);
      const parentHeight = parent?.translation?.z ? parent?.translation?.z : 0;
      return parentHeight + getParentHeight(parentId);
    } else {
      return 0;
    }
  };

  const onAlign = () => {
    const { updateItem } = forModelData(modelData);
    const gridfinityHeight = gridfinityHeightOf(modelData);
    const parentHeight = getParentHeight(item.id);
    const updatedItem = alignItem(item, gridfinityHeight - parentHeight);
    setModelData(
      updateItem(updatedItem),
      EditorHistoryType.OBJ_UPDATED,
      item.id
    );
    console.log("Aligning Item", item);
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

export default AlignWithGridfinity;
