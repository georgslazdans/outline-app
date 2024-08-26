"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionGroup from "@/components/editor/ui/action/ActionGroup";
import React from "react";
import AddPoint from "./AddPoint";
import AddHole from "./AddHole";

type Props = {
  dictionary: Dictionary;
};

const AddButtonGroup = ({ dictionary }: Props) => {
  return (
    <>
      <ActionGroup dictionary={dictionary} name={"Add"}>
        <AddPoint dictionary={dictionary}></AddPoint>
        <AddHole dictionary={dictionary}></AddHole>
      </ActionGroup>
    </>
  );
};

export default AddButtonGroup;
