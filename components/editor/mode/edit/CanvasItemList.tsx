"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback } from "react";
import CanvasItem from "./CanvasItem";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import GroupTransform from "./ui/three/GroupTransform";

type Props = {
  dictionary: Dictionary;
  items: Item[];
  parents?: Item[];
  onItemChange: (item: Item) => void;
};

const CanvasItemList = ({ dictionary, items, parents, onItemChange }: Props) => {
  const getWithParents = useCallback(
    (item: Item) => {
      if (parents) {
        console.log("Parents!", parents);
        return [...parents, item];
      }
      return [item];
    },
    [parents]
  );

  return (
    <>
      {items.map((item) => {
        if (item.type == ItemType.Group) {
          return (
            <>
              <GroupTransform
                key={item.id + "transform"}
                group={item}
                onItemChange={onItemChange}
              ></GroupTransform>
              <CanvasItemList
                key={item.id}
                dictionary={dictionary}
                items={item.items}
                onItemChange={onItemChange}
                parents={getWithParents(item)}
              ></CanvasItemList>
            </>
          );
        } else {
          return (
            <CanvasItem
              key={item.id}
              dictionary={dictionary}
              item={item}
              onItemChange={onItemChange}
              parents={parents}
            ></CanvasItem>
          );
        }
      })}
    </>
  );
};

export default CanvasItemList;
