"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";
import Item from "@/lib/replicad/model/Item";
import ItemTypeIcon from "./icons/ItemTypeIcon";
import DuplicateGroup from "./action/DuplicateGroup";
import RemoveSelected from "./action/RemoveSelected";

type Props = {
  className?: string;
  dictionary: Dictionary;
  item: Item;
  onItemChanged: (item: Item) => void;
  groupLevel: number;
};

const TreeElement = ({
  dictionary,
  className,
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
        <ItemTypeIcon className="my-auto mr-2" itemType={item.type}></ItemTypeIcon>

        <ItemName
          dictionary={dictionary}
          item={item}
          onChanged={onNameChanged}
        ></ItemName>
        {selectedId == item.id && (
          <>
            <DuplicateGroup
              dictionary={dictionary}
              selectedItem={item}
            ></DuplicateGroup>
            <RemoveSelected
              dictionary={dictionary}
              item={item}
            ></RemoveSelected>
          </>
        )}
      </div>
    </li>
  );
};

export default TreeElement;
