"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";
import Item from "@/lib/replicad/Item";

type Props = {
  className?: string;
  style?: CSSProperties;
  dictionary: Dictionary;
  index: number;
  item: Item;
  onItemChanged: (item: Item) => void;
};

const TreeElement = ({
  dictionary,
  className,
  style,
  index,
  item,
  onItemChanged,
}: Props) => {
  const { selectedId, setSelectedId } = useEditorContext();

  const onSelected = () => {
    setSelectedId(item.id);
  };

  const onNameChanged = (name: string) => {
    const updatedItem: Item = { ...item, name: name };
    onItemChanged(updatedItem);
  };

  const selectedStyle = () => {
    return item.id == selectedId ? " bg-gray " : "";
  };

  return (
    <li
      className={selectedStyle() + " " + className}
      style={style}
      onClick={onSelected}
    >
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
