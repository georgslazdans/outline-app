"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { SphereParams } from "@/lib/replicad/PrimitiveParams";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  sphereParams: SphereParams;
  onParamsChange: (params: SphereParams) => void;
};

const SphereEdit = ({ dictionary, sphereParams, onParamsChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...sphereParams, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  return (
    <>
      <NumberField
        value={sphereParams.radius}
        onChange={handleNumberChange("radius")}
        label={"Radius"}
        name={"radius"}
      ></NumberField>
    </>
  );
};

export default SphereEdit;
