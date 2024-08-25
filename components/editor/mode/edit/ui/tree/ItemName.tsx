"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import InputField from "@/components/fields/InputField";
import Item from "@/lib/replicad/model/Item";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onChanged: (value: string) => void;
};

const ItemName = ({ dictionary, item, onChanged }: Props) => {
  const { setInputFieldFocused, selectedId } = useEditorContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    onChanged(newName);
  };

  useEffect(() => {
    if (isEditing && item.id != selectedId) {
      setIsEditing(false);
      setInputFieldFocused(false);
    }
  }, [isEditing, selectedId]);

  const handleEditClick = () => {
    if (item.id == selectedId) {
      setIsEditing(true);
    }
  };

  const handleFocus = () => {
    setInputFieldFocused(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setInputFieldFocused(false);
  };

  const id = `edit-item-name-${item.id}`;
  return (
    <>
      {isEditing ? (
        <InputField
          className="ml-2 mr-auto"
          type="text"
          value={item.name}
          onChange={handleNameChange}
          autofocus
          name={"model-name"}
          padding=""
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      ) : (
        <label
          id={id}
          className={
            "flex-grow content-center cursor-pointer hover:bg-gray " +
            (item.id == selectedId ? "dark:text-black " : "")
          }
          onClick={handleEditClick}
        >
          {item.name}
        </label>
      )}

      <Tooltip
        anchorSelect={"#" + id}
        place="top"
        hidden={item.id != selectedId}
      >
        Edit Name
      </Tooltip>
    </>
  );
};

export default ItemName;
