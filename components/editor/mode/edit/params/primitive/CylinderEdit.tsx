"use client";

import { Dictionary } from "@/app/dictionaries";
import { CylinderParams } from "@/lib/replicad/PrimitiveParams";
import React, { ChangeEvent } from "react";
import EditField from "../../../EditField";

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
      <EditField
        value={cylinderParams.radius}
        onChange={handleNumberChange("radius")}
        label={"Radius"}
        name={"radius"}
      ></EditField>
      <EditField
        value={cylinderParams.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
      ></EditField>
    </>
  );
};

export default CylinderEdit;
