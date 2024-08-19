"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { BoxParams } from "@/lib/replicad/PrimitiveParams";
import React, { ChangeEvent } from "react";

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
      <NumberField
        value={boxParams.width}
        onChange={handleNumberChange("width")}
        label={"Width"}
        name={"width"}
      ></NumberField>
      <NumberField
        value={boxParams.length}
        onChange={handleNumberChange("length")}
        label={"Length"}
        name={"length"}
      ></NumberField>
      <NumberField
        value={boxParams.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
      ></NumberField>
    </>
  );
};

export default BoxEdit;
