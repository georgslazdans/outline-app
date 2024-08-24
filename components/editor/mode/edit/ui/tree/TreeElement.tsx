"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";
import Item from "@/lib/replicad/model/Item";
import ItemTypeIcon from "./icons/ItemTypeIcon";

type Props = {
  className?: string;
  style?: CSSProperties;
  dictionary: Dictionary;
  index: number;
  item: Item;
  onItemChanged: (item: Item) => void;
  groupLevel: number;
};

const TreeElement = ({
  dictionary,
  className,
  style,
  index,
  item,
  onItemChanged,
  groupLevel,
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

  const groupLevelMargin = () => `${groupLevel * 2}rem`;
  const getGroupStyle: CSSProperties = {
    marginLeft: groupLevelMargin(),
  };

  return (
    <li
      className={selectedStyle() + " " + className}
      style={getGroupStyle}
      onClick={onSelected}
    >
      <div className="flex flex-row ml-2 mr-2">
        <label
          className={
            "p-1 mr-2 " + (item.id == selectedId ? "dark:text-black " : "")
          }
        >
          <ItemTypeIcon itemType={item.type}></ItemTypeIcon>
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
