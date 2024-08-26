"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import React from "react";

type Props = {
  dictionary: Dictionary;
};

const icon = "";

const AddPoint = ({ dictionary }: Props) => {
  const onAddPoint = () => {};
  return (
    <ActionButton
      id="add-point"
      onClick={onAddPoint}
      dictionary={dictionary}
      icon={icon}
      label="Point"
      tooltip="Add Point"
    ></ActionButton>
  );
};

export default AddPoint;
