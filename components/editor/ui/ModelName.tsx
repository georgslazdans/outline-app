"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";
import InputField from "../../fields/InputField";
import { useModelContext } from "../../../context/ModelContext";
import { useEditorContext } from "../EditorContext";

type Props = {
  dictionary: Dictionary;
};

const ModelName = ({ dictionary }: Props) => {
  const { setInputFieldFocused } = useEditorContext();

  const { model, setModel } = useModelContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setModel((prev) => {
      return { ...prev, name: newName };
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
      <h1 className="text-center p-2 flex flex-row">
        <span className="ml-auto">{"Editing - "}</span>
        {isEditing ? (
          <InputField
            className="ml-2 mr-auto"
            type="text"
            value={model.name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            autofocus
            name={"model-name"}
            padding=""
            onFocus={handleFocus}
          />
        ) : (
          <span
            onClick={handleEditClick}
            className="ml-2 mr-auto cursor-pointer hover:bg-gray"
          >
            {model.name}
          </span>
        )}
      </h1>
    </>
  );
};

export default ModelName;
