"use client";

import { Dictionary } from "@/app/dictionaries";
import { BoxParams } from "@/lib/replicad/model/item/PrimitiveParams";
import React, { ChangeEvent } from "react";
import EditField from "../../../EditField";

type Props = {
  dictionary: Dictionary;
  boxParams: BoxParams;
  onParamsChange: (params: BoxParams) => void;
};

const BoxEdit = ({ dictionary, boxParams, onParamsChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...boxParams, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <EditField
          className="w-full"
          value={boxParams.width}
          onChange={handleNumberChange("width")}
          label={"Width"}
          name={"width"}
        ></EditField>
        <EditField
          className="w-full"
          value={boxParams.length}
          onChange={handleNumberChange("length")}
          label={"Length"}
          name={"length"}
        ></EditField>
        <EditField
          className="w-full"
          value={boxParams.height}
          onChange={handleNumberChange("height")}
          label={"Height"}
          name={"height"}
        ></EditField>
      </div>
    </>
  );
};

export default BoxEdit;
