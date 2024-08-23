"use client";

import { Dictionary } from "@/app/dictionaries";
import SelectField from "@/components/fields/SelectField";
import BooleanOperation, {
  booleanOperationOptionsFor,
} from "@/lib/replicad/BooleanOperation";
import Item from "@/lib/replicad/Item";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
};

const BooleanOperationEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleOperationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (item.booleanOperation != value) {
      const operation = value as BooleanOperation;
      onItemChange({ ...item, booleanOperation: operation });
    }
  };
  return (
    <>
      <SelectField
        label="Boolean Operation"
        name={"boolean-operation"}
        options={booleanOperationOptionsFor(dictionary)}
        value={item.booleanOperation}
        onChange={handleOperationChange}
      ></SelectField>
    </>
  );
};

export default BooleanOperationEdit;
