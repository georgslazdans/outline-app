"use client";

import { Dictionary } from "@/app/dictionaries";
import { SphereParams } from "@/lib/replicad/model/item/PrimitiveParams";
import React, { ChangeEvent } from "react";
import EditField from "../../../EditField";

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
      <EditField
        value={sphereParams.radius}
        onChange={handleNumberChange("radius")}
        label={"Radius"}
        name={"radius"}
      ></EditField>
    </>
  );
};

export default SphereEdit;
