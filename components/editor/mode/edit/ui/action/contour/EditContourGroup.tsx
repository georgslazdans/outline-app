"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import EditContour from "./EditContour";
import ActionGroup from "../../../../../ui/action/ActionGroup";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const EditContourGroup = ({ dictionary, selectedItem }: Props) => {
  const isContour = () => {
    return selectedItem?.type == ItemType.Contour;
  };
  return (
    <>
      {selectedItem && isContour() && (
        <ActionGroup dictionary={dictionary} name={"Contour"}>
          <EditContour dictionary={dictionary}></EditContour>
        </ActionGroup>
      )}
    </>
  );
};

export default EditContourGroup;
