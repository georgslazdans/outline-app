"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";
import Item from "@/lib/replicad/model/Item";
import ItemTypeIcon from "./icon/itemType/ItemTypeIcon";
import DuplicateItem from "./action/DuplicateItem";
import RemoveSelected from "./action/RemoveSelected";
import BooleanOperationIcon from "./icon/boolean/BooleanOperationIcon";

type Props = {
  className?: string;
  dictionary: Dictionary;
  item: Item;
  onItemChanged: (item: Item) => void;
  groupLevel: number;
  index: number;
};

const TreeElement = ({
  dictionary,
  className,
  item,
  onItemChanged,
  groupLevel,
  index,
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

  const showBooleanIcon = () => {
    return index != 0;
  };

  return (
    <li
      className={selectedStyle() + " " + className}
      style={getGroupStyle}
      onClick={onSelected}
    >
      <div className="flex flex-row ml-2 mr-2">
        {showBooleanIcon() && item.booleanOperation && (
          <BooleanOperationIcon
            className="my-auto mr-2"
            operation={item.booleanOperation}
          ></BooleanOperationIcon>
        )}
        <ItemTypeIcon
          className="my-auto mr-2"
          itemType={item.type}
        ></ItemTypeIcon>

        <ItemName
          dictionary={dictionary}
          item={item}
          onChanged={onNameChanged}
        ></ItemName>
        {selectedId == item.id && (
          <div className="flex flex-row gap-1">
            <DuplicateItem
              dictionary={dictionary}
              selectedItem={item}
            ></DuplicateItem>
            <RemoveSelected
              dictionary={dictionary}
              item={item}
            ></RemoveSelected>
          </div>
        )}
      </div>
    </li>
  );
};

export default TreeElement;
