"use client";

import { Dictionary } from "@/app/dictionaries";
import { CapsuleParams } from "@/lib/replicad/model/item/PrimitiveParams";
import React, { ChangeEvent } from "react";
import EditField from "../../../EditField";

type Props = {
  dictionary: Dictionary;
  capsuleParams: CapsuleParams;
  onParamsChange: (params: CapsuleParams) => void;
};

const CapsuleEdit = ({
  dictionary,
  capsuleParams,
  onParamsChange,
}: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...capsuleParams, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <EditField
          className="w-full"
          value={capsuleParams.radius}
          onChange={handleNumberChange("radius")}
          label={"Radius"}
          name={"radius"}
        ></EditField>
        <EditField
          className="w-full"
          value={capsuleParams.middleHeight}
          onChange={handleNumberChange("middleHeight")}
          label={"Height"}
          name={"height"}
        ></EditField>
      </div>
    </>
  );
};

export default CapsuleEdit;
