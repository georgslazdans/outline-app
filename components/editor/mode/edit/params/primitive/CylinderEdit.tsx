"use client";

import { Dictionary } from "@/app/dictionaries";
import { CylinderParams } from "@/lib/replicad/model/item/PrimitiveParams";
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
      <div className="flex flex-row gap-2">
        <EditField
          className="w-full"
          value={cylinderParams.radius}
          onChange={handleNumberChange("radius")}
          label={"Radius"}
          name={"radius"}
        ></EditField>
        <EditField
          className="w-full"
          value={cylinderParams.height}
          onChange={handleNumberChange("height")}
          label={"Height"}
          name={"height"}
        ></EditField>
      </div>
    </>
  );
};

export default CylinderEdit;
