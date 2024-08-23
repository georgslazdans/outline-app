"use client";

import { Dictionary } from "@/app/dictionaries";
import SelectField from "@/components/fields/SelectField";
import React, { ChangeEvent } from "react";
import SphereEdit from "./SphereEdit";
import PrimitiveParams, {
  BoxParams,
  CylinderParams,
  defaultParamsFor,
  SphereParams,
} from "@/lib/replicad/model/item/PrimitiveParams";
import BoxEdit from "./BoxEdit";
import CylinderEdit from "./CylinderEdit";
import TransformEdit from "../TransformEdit";
import Item from "@/lib/replicad/model/Item";
import BooleanOperationEdit from "../BooleanOperationEdit";
import Primitive from "@/lib/replicad/model/item/Primitive";
import PrimitiveType, { primitiveTypeOptionsFor } from "@/lib/replicad/model/item/PrimitiveType";

type Props = {
  dictionary: Dictionary;
  item: Item & Primitive;
  onItemChange: (params: Item) => void;
};

const PrimitiveEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (item.params.type != value) {
      const updatedParams = defaultParamsFor(value as PrimitiveType);
      const updatedItem = { ...item, params: updatedParams };
      onItemChange(updatedItem);
    }
  };

  const handleParamsChange = (params: PrimitiveParams) => {
    const updatedItem = { ...item, params: params };
    onItemChange(updatedItem);
  };

  const isCurrentType = (type: PrimitiveType) => {
    return item.params.type == type;
  };

  return (
    <>
      <SelectField
        label="Primitive Type"
        name={"primitive-type"}
        options={primitiveTypeOptionsFor(dictionary)}
        value={item.params.type}
        onChange={handleTypeChange}
      ></SelectField>
      {isCurrentType(PrimitiveType.SPHERE) && (
        <SphereEdit
          dictionary={dictionary}
          sphereParams={item.params as SphereParams}
          onParamsChange={handleParamsChange}
        ></SphereEdit>
      )}
      {isCurrentType(PrimitiveType.BOX) && (
        <BoxEdit
          dictionary={dictionary}
          boxParams={item.params as BoxParams}
          onParamsChange={handleParamsChange}
        ></BoxEdit>
      )}
      {isCurrentType(PrimitiveType.CYLINDER) && (
        <CylinderEdit
          dictionary={dictionary}
          cylinderParams={item.params as CylinderParams}
          onParamsChange={handleParamsChange}
        ></CylinderEdit>
      )}
      <BooleanOperationEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></BooleanOperationEdit>
      <TransformEdit
        dictionary={dictionary}
        item={item}
        onItemChange={onItemChange}
      ></TransformEdit>
    </>
  );
};

export default PrimitiveEdit;
