"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import EditContour from "./EditContour";
import ActionGroup from "../../../../../ui/action/ActionGroup";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import SplitContour from "./SplitContour";
import CreateContourShell from "./CreateContourShell";
import Contour from "@/lib/replicad/model/item/contour/Contour";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const EditContourGroup = ({ dictionary, selectedItem }: Props) => {
  const isContour = () => {
    return selectedItem?.type == ItemType.Contour;
  };

  const canAddModification = () => {
    return (
      selectedItem?.type == ItemType.Contour &&
      (!selectedItem.modifications || selectedItem.modifications.length == 0)
    );
  };

  return (
    <>
      {selectedItem && isContour() && (
        <ActionGroup dictionary={dictionary} name={"Contour"}>
          <EditContour dictionary={dictionary}></EditContour>
          <SplitContour dictionary={dictionary}></SplitContour>
          {canAddModification() && (
            <CreateContourShell
              dictionary={dictionary}
              item={selectedItem as Item & Contour}
            ></CreateContourShell>
          )}
        </ActionGroup>
      )}
    </>
  );
};

export default EditContourGroup;
