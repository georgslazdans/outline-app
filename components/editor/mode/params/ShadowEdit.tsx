"use client";

import { Dictionary } from "@/app/dictionaries";
import NumberField from "@/components/fields/NumberField";
import { Item, Shadow } from "@/lib/replicad/Model";
import React, { ChangeEvent } from "react";

type Props = {
  dictionary: Dictionary;
  params: Item & Shadow;
  onParamsChange: (params: Item & Shadow) => void;
};

const ShadowEdit = ({ dictionary, params, onParamsChange }: Props) => {
  const handleNumberChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedParams = { ...params, [name]: value };
      onParamsChange(updatedParams);
    };
  };

  const handleTranslationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedTranslation = { ...params.translation!, [name]: value };
      const updatedParams = { ...params, translation: updatedTranslation };
      onParamsChange(updatedParams);
    };
  };

  const handleRotationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedRotation = { ...params.rotation!, [name]: value };
      const updatedParams = { ...params, rotation: updatedRotation };
      onParamsChange(updatedParams);
    };
  };

  return (
    <>
      <NumberField
        value={params.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
      ></NumberField>
      <NumberField
        value={params.translation!.x}
        onChange={handleTranslationChange("x")}
        label={"X"}
        name={"x"}
      ></NumberField>
      <NumberField
        value={params.translation!.y}
        onChange={handleTranslationChange("y")}
        label={"Y"}
        name={"y"}
      ></NumberField>
      <NumberField
        value={params.translation!.z}
        onChange={handleTranslationChange("z")}
        label={"Z"}
        name={"z"}
      ></NumberField>
      <NumberField
        value={params.rotation!.x}
        onChange={handleRotationChange("x")}
        label={"Rotation X"}
        name={"rotationX"}
      ></NumberField>
      <NumberField
        value={params.rotation!.y}
        onChange={handleRotationChange("y")}
        label={"Rotation Y"}
        name={"rotationY"}
      ></NumberField>
      <NumberField
        value={params.rotation!.z}
        onChange={handleRotationChange("z")}
        label={"Rotation Z"}
        name={"rotationZ"}
      ></NumberField>
    </>
  );
};

export default ShadowEdit;
