"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import { useModelContext } from "../ModelContext";
import { useEditorContext } from "../EditorContext";
import NameEditField from "@/components/fields/NameEditField";

type Props = {
  dictionary: Dictionary;
};

const ModelName = ({ dictionary }: Props) => {
  const { setInputFieldFocused } = useEditorContext();

  const { model, setModel } = useModelContext();

  const handleNameChange = (newName: string) => {
    setModel((prev) => {
      return { ...prev, name: newName };
    });
  };

  const handleFocus = () => {
    setInputFieldFocused(true);
  };

  const handleBlur = () => {
    setInputFieldFocused(false);
  };

  return (
    <>
      <NameEditField
        title="Editing"
        value={model.name}
        onNameChanged={handleNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      ></NameEditField>
    </>
  );
};

export default ModelName;
