"use client";

import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import InputField from "./InputField";

type Props = {
  title: string;
  value: string;
  onNameChanged: (name: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

const ModelName = ({ title, value, onNameChanged, onBlur, onFocus }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    onNameChanged(newName);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFocus = () => {
    onFocus();
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  return (
    <>
      <h1 className="text-center p-2 flex flex-col xl:flex-row mb-2 mt-2 max-w-64 xl:max-w-full mx-auto">
        <span className="xl:ml-auto">{title}</span>
        <span className="px-1 hidden xl:block">-</span>
        {isEditing ? (
          <InputField
            className="ml-2 mr-auto"
            type="text"
            value={value}
            onChange={handleNameChange}
            onBlur={handleBlur}
            autofocus
            name={"model-name"}
            padding=""
            onFocus={handleFocus}
          />
        ) : (
          <span
            id="model-name-field"
            onClick={handleEditClick}
            className="ml-2 mr-auto cursor-pointer hover:bg-gray"
          >
            {value}
          </span>
        )}
      </h1>
      <Tooltip anchorSelect={"#model-name-field"} place="top">
        Edit
      </Tooltip>
    </>
  );
};

export default ModelName;
