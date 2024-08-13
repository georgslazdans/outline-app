"use client";

import { Dictionary } from "@/app/dictionaries";
import CheckboxField from "@/components/fields/CheckboxField";
import NumberField from "@/components/fields/NumberField";
import GridfinityParams from "@/lib/replicad/GridfinityParams";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  params: GridfinityParams;
  onParamsChange: (params: GridfinityParams) => void;
};

const GridfinityEdit = ({ dictionary, params, onParamsChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...params, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  const handleCheckboxChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedParams = { ...params, [name]: event.target.checked };
      onParamsChange(updatedParams);
    };
  };
  return (
    <>
      <NumberField
        value={params.xSize}
        onChange={handleNumberChange("xSize")}
        label={"x Size"}
        name={"xSize"}
      ></NumberField>
      <NumberField
        value={params.ySize}
        onChange={handleNumberChange("ySize")}
        label={"y Size"}
        name={"ySize"}
      ></NumberField>
      <NumberField
        value={params.height}
        onChange={handleNumberChange("height")}
        label={"height"}
        name={"height"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></NumberField>
      <CheckboxField
        value={params.keepFull}
        onChange={handleCheckboxChange("keepFull")}
        label={"Keep Full"}
        name={"keepFull"}
      ></CheckboxField>
      <NumberField
        value={params.wallThickness}
        onChange={handleNumberChange("wallThickness")}
        label={"Wall Thickness"}
        name={"wallThickness"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></NumberField>
      <CheckboxField
        value={params.withMagnet}
        onChange={handleCheckboxChange("withMagnet")}
        label={"With Magnet"}
        name={"withMagnet"}
      ></CheckboxField>
      <CheckboxField
        value={params.withScrew}
        onChange={handleCheckboxChange("withScrew")}
        label={"With Screw"}
        name={"withScrew"}
      ></CheckboxField>
      <NumberField
        value={params.magnetRadius}
        onChange={handleNumberChange("magnetRadius")}
        label={"Magnet Radius"}
        name={"magnetRadius"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></NumberField>
      <NumberField
        value={params.magnetHeight}
        onChange={handleNumberChange("magnetHeight")}
        label={"Magnet Height"}
        name={"magnetHeight"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></NumberField>
      <NumberField
        value={params.screwRadius}
        onChange={handleNumberChange("screwRadius")}
        label={"Screw Radius"}
        name={"screwRadius"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></NumberField>
    </>
  );
};

export default GridfinityEdit;
