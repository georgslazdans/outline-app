"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import React from "react";

type Props = {
  dictionary: Dictionary;
};

const icon = "";

const AddHole = ({ dictionary }: Props) => {
  const onAddHole = () => {};
  return (
    <ActionButton
      id="add-hole"
      onClick={onAddHole}
      dictionary={dictionary}
      icon={icon}
      label="Hole"
      tooltip="Add Hole"
    ></ActionButton>
  );
};

export default AddHole;
