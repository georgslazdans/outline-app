"use client";

import { Dictionary } from "@/app/dictionaries";
import SelectField from "@/components/fields/SelectField";
import { Item, Primitive } from "@/lib/replicad/Model";
import PrimitiveType, {
  primitiveTypeOptionsFor,
} from "@/lib/replicad/PrimitiveType";
import React, { ChangeEvent } from "react";
import SphereEdit from "./SphereEdit";
import PrimitiveParams, {
  BoxParams,
  CylinderParams,
  defaultParamsFor,
  SphereParams,
} from "@/lib/replicad/PrimitiveParams";
import BoxEdit from "./BoxEdit";
import CylinderEdit from "./CylinderEdit";

type Props = {
  dictionary: Dictionary;
  item: Item & Primitive;
  onParamsChange: (params: Item & Primitive) => void;
};

const PrimitiveEdit = ({ dictionary, item, onParamsChange }: Props) => {
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (item.params.type != value) {
      const updatedParams = defaultParamsFor(value as PrimitiveType);
      const updatedItem = { ...item, params: updatedParams };
      onParamsChange(updatedItem);
    }
  };

  const handleParamsChange = (params: PrimitiveParams) => {
    const updatedItem = { ...item, params: params };
    onParamsChange(updatedItem);
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
    </>
  );
};

export default PrimitiveEdit;
