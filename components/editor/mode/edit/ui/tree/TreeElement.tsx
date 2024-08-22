"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import { Item } from "@/lib/replicad/Model";
import React from "react";
import ItemName from "./ItemName";

type Props = {
  dictionary: Dictionary;
  index: number;
  item: Item;
  onItemChanged: (item: Item) => void;
};

const TreeElement = ({ dictionary, index, item, onItemChanged }: Props) => {
  const { selectedId, setSelectedId } = useEditorContext();

  const onSelected = () => {
    setSelectedId(item.id);
  };

  const onNameChanged = (name: string) => {
    const updatedItem: Item = { ...item, name: name };
    onItemChanged(updatedItem);
  };

  return (
    <li className={item.id == selectedId ? "bg-gray" : ""} onClick={onSelected}>
      <div className="flex flex-row ml-2 mr-2">
        <label
          className={
            "p-1 mr-2 " + (item.id == selectedId ? "dark:text-black " : "")
          }
        >
          {index + 1}
        </label>

        <ItemName
          dictionary={dictionary}
          item={item}
          onChanged={onNameChanged}
        ></ItemName>
      </div>
    </li>
  );
};

export default TreeElement;
