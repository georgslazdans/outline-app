"use client";

import { Dictionary } from "@/app/dictionaries";
import { Draggable } from "@hello-pangea/dnd";
import React, {  ReactNode } from "react";
import Item from "@/lib/replicad/model/Item";

type Props = {
  children: ReactNode;
  dictionary: Dictionary;
  item: Item;
  index: number;
};

const DraggableItem = ({
  children,
  dictionary,
  item,
  index
}: Props) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;
