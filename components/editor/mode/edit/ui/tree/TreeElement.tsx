"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";
import Item from "@/lib/replicad/model/Item";
import ItemTypeIcon from "../icon/itemType/ItemTypeIcon";
import DuplicateItem from "./action/DuplicateItem";
import DeleteSelected from "./action/DeleteSelected";
import BooleanOperationIcon from "../icon/boolean/BooleanOperationIcon";
import BooleanOperation from "@/lib/replicad/model/BooleanOperation";

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
    return index != 0 && item.booleanOperation;
  };

  const onGroupClick = () => {
    let updatedOperation = BooleanOperation.UNION;
    if (item.booleanOperation == BooleanOperation.UNION) {
      updatedOperation = BooleanOperation.CUT;
    }
    onItemChanged({ ...item, booleanOperation: updatedOperation });
  };

  return (
    <li
      className={selectedStyle() + " " + className}
      style={getGroupStyle}
      onClick={onSelected}
    >
      <div className="flex flex-row ml-2 mr-2">
        {showBooleanIcon() && (
          <BooleanOperationIcon
            className="my-auto mr-2"
            operation={item.booleanOperation!}
            onClick={onGroupClick}
          ></BooleanOperationIcon>
        )}
        {!showBooleanIcon() && <div className="size-6 mr-2"></div>}

        <ItemTypeIcon
          className={
            "my-auto mr-2 " +
            (item.id == selectedId
              ? "dark:text-black "
              : "text-black dark:text-white")
          }
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
            <DeleteSelected
              dictionary={dictionary}
              item={item}
            ></DeleteSelected>
          </div>
        )}
      </div>
    </li>
  );
};

export default TreeElement;
