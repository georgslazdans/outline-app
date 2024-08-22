"use client";

import { Dictionary } from "@/app/dictionaries";
import ModelData from "@/lib/replicad/ModelData";
import React from "react";
import TreeElement from "./TreeElement";
import { Item } from "@/lib/replicad/Model";
import { UpdateModelData } from "@/components/editor/EditorComponent";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  setModelData: UpdateModelData;
};

const ItemTree = ({ dictionary, modelData, setModelData }: Props) => {
  const onItemChanged = (item: Item) => {
    const updatedData = {
      items: modelData.items.map((it) => {
        if (it.id == item.id) {
          return item;
        }
        return it;
      }),
    };
    setModelData(updatedData, EditorHistoryType.OBJ_DELETED, item.id);
  };
  return (
    <>
      <div className="w-full border rounded h-[10.4rem] overflow-y-scroll">
        <ul className="">
          {modelData.items.map((it, index) => (
            <TreeElement
              dictionary={dictionary}
              index={index}
              item={it}
              onItemChanged={onItemChanged}
            ></TreeElement>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ItemTree;
