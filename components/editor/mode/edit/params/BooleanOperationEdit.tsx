"use client";

import { Dictionary } from "@/app/dictionaries";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import SelectField from "@/components/fields/SelectField";
import BooleanOperation, {
  booleanOperationOptionsFor,
} from "@/lib/replicad/model/BooleanOperation";
import Item from "@/lib/replicad/model/Item";
import ItemGroup from "@/lib/replicad/model/item/ItemGroup";
import { forModelData } from "@/lib/replicad/model/ModelData";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
};

const BooleanOperationEdit = ({ dictionary, item, onItemChange }: Props) => {
  const { modelData } = useModelDataContext();

  const isFirstElementOfGroup = (): boolean => {
    const parentId = forModelData(modelData).findParentId(item.id);
    if (parentId) {
      const group = forModelData(modelData).getById(parentId) as ItemGroup;
      return group.items[0].id == item.id;
    } else {
      return modelData.items[0].id == item.id;
    }
  };

  const handleOperationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (item.booleanOperation != value) {
      const operation = value as BooleanOperation;
      onItemChange({ ...item, booleanOperation: operation });
    }
  };
  return (
    <>
      {!isFirstElementOfGroup() && (
        <SelectField
          label="Boolean Operation"
          name={"boolean-operation"}
          options={booleanOperationOptionsFor(dictionary)}
          value={item.booleanOperation}
          onChange={handleOperationChange}
        ></SelectField>
      )}
    </>
  );
};

export default BooleanOperationEdit;
