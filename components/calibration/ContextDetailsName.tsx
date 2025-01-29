"use client";

import React from "react";
import NameEditField from "@/components/fields/NameEditField";
import { Context, useDetails } from "@/context/DetailsContext";

type Props = {
};

const ContextDetailsName = ({}: Props) => {
  const { detailsContext, setDetailsContext } = useDetails();

  const handleNameChange = (newName: string) => {
    setDetailsContext((prev: Context) => {
      const details = { ...prev.details, name: newName };
      return { ...prev, details: details };
    });
  };

  const handleFocus = () => {};

  const handleBlur = () => {};

  return (
    <>
      <NameEditField
        title="Calibrating"
        value={detailsContext.details.name}
        onNameChanged={handleNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      ></NameEditField>
    </>
  );
};

export default ContextDetailsName;
