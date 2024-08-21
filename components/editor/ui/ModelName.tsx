"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { useState } from "react";
import InputField from "../../fields/InputField";

type Props = {
  dictionary: Dictionary;
};

const ModelName = ({ dictionary }: Props) => {
  const [name, setName] = useState<string>("Untitled");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      <h1 className="text-center p-2 flex flex-row">
        <span className="ml-auto">{"Editing - "}</span>
        {isEditing ? (
          <InputField
            className="ml-2 mr-auto"
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            autofocus
            name={"model-name"}
            padding=""
          />
        ) : (
          <span
            onClick={handleEditClick}
            className="ml-2 mr-auto cursor-pointer hover:bg-gray"
          >
            {name}
          </span>
        )}
      </h1>
    </>
  );
};

export default ModelName;
