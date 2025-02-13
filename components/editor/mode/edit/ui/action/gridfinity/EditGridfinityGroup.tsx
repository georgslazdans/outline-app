"use client";

import { Dictionary } from "@/app/dictionaries";
import React from "react";
import ActionGroup from "../../../../../ui/action/ActionGroup";
import Item from "@/lib/replicad/model/Item";
import ItemType from "@/lib/replicad/model/ItemType";
import SplitGridfinityBox from "./SplitGridfinityBox";
import Gridfinity from "@/lib/replicad/model/item/gridfinity/Gridfinity";

type Props = {
  dictionary: Dictionary;
  selectedItem?: Item;
};

const EditGridfinityGroup = ({ dictionary, selectedItem }: Props) => {
  const canAddModification = () => {
    return (
      selectedItem?.type == ItemType.Gridfinity &&
      (!selectedItem.modifications || selectedItem.modifications.length == 0)
    );
  };
  return (
    <>
      {selectedItem && canAddModification() && (
        <ActionGroup dictionary={dictionary} name={"Gridfinity"}>
          <SplitGridfinityBox
            dictionary={dictionary}
            item={selectedItem as Item & Gridfinity}
          ></SplitGridfinityBox>
        </ActionGroup>
      )}
    </>
  );
};

export default EditGridfinityGroup;
