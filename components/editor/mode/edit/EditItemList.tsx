"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useCallback } from "react";
import EditItem from "./EditItem";
import Item from "@/lib/replicad/Item";
import ModelType from "@/lib/replicad/ModelType";

type Props = {
  dictionary: Dictionary;
  items: Item[];
  parents?: Item[];
  onItemChange: (item: Item) => void;
};

const EditItemList = ({ dictionary, items, parents, onItemChange }: Props) => {
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
        if (item.type == ModelType.Group) {
          return (
            <EditItemList
              key={item.id}
              dictionary={dictionary}
              items={item.items}
              onItemChange={onItemChange}
              parents={getWithParents(item)}
            ></EditItemList>
          );
        } else {
          return (
            <EditItem
              key={item.id}
              dictionary={dictionary}
              item={item}
              onItemChange={onItemChange}
              parents={parents}
            ></EditItem>
          );
        }
      })}
    </>
  );
};

export default EditItemList;
