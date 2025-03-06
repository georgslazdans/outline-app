"use client";

import Item from "@/lib/replicad/model/Item";
import EditField from "../../../EditField";
import { ShellModification } from "@/lib/replicad/model/item/contour/ShellModification";
import { ChangeEvent } from "react";

type Props = {
  item: Item & ShellModification;
  onItemChange: (item: Item) => void;
};

const ShellModificationEdit = ({ item, onItemChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...item, [name]: value };
      onItemChange(updatedParams);
    };
  };
  return (
    <>
      <EditField
        value={item.wallThickness}
        onChange={handleNumberChange("wallThickness")}
        label={"Wall Thickness"}
        name={"wallThickness"}
      ></EditField>
    </>
  );
};

export default ShellModificationEdit;
