"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import InputField from "@/components/fields/InputField";
import { Item } from "@/lib/replicad/Model";
import React, { useState } from "react";

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
          className={
            "flex-grow content-center cursor-pointer hover:bg-gray " +
            (item.id == selectedId ? "dark:text-black " : "")
          }
          onClick={handleEditClick}
        >
          {item.name}
        </label>
      )}
    </>
  );
};

export default ItemName;
