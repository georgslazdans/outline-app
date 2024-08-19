"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { CylinderParams } from "@/lib/replicad/PrimitiveParams";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  cylinderParams: CylinderParams;
  onParamsChange: (params: CylinderParams) => void;
};

const CylinderEdit = ({
  dictionary,
  cylinderParams,
  onParamsChange,
}: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...cylinderParams, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  return (
    <>
      <NumberField
        value={cylinderParams.radius}
        onChange={handleNumberChange("radius")}
        label={"Radius"}
        name={"radius"}
      ></NumberField>
      <NumberField
        value={cylinderParams.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
      ></NumberField>
    </>
  );
};

export default CylinderEdit;
