"use client";

import { Dictionary } from "@/app/dictionaries";
import { Draggable } from "@hello-pangea/dnd";
import React, { CSSProperties } from "react";
import TreeElement from "./TreeElement";
import Item from "@/lib/replicad/model/Item";

type Props = {
  dictionary: Dictionary;
  item: Item;
  index: number;
  onItemChanged: (item: Item) => void;
  groupLevel: number;
};

const DraggableItem = ({
  dictionary,
  item,
  index,
  onItemChanged,
  groupLevel,
}: Props) => {
  const groupClass = (groupLevel: number) => {
    if (groupLevel && groupLevel != 0) {
      const level = 4 * groupLevel;
      return "ml-" + level;
    }
    return "";
  };
  const groupLevelMargin = () => `${groupLevel * 2}rem`;
  const getGroupStyle: CSSProperties = {
    marginLeft: groupLevelMargin(),
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TreeElement
            style={getGroupStyle}
            dictionary={dictionary}
            index={index}
            item={item}
            onItemChanged={onItemChanged}
          ></TreeElement>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;
