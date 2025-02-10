"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent } from "react";
import EditField from "../../EditField";
import Item from "@/lib/replicad/model/Item";
import AlignWithGridfinityButton from "./AlignWithGridfinityButton";

type Props = {
  dictionary: Dictionary;
  item: Item;
  onItemChange: (item: Item) => void;
};

const TransformEdit = ({ dictionary, item, onItemChange }: Props) => {
  const handleTranslationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedTranslation = { ...item.translation!, [name]: value };
      const updatedParams = { ...item, translation: updatedTranslation };
      onItemChange(updatedParams);
    };
  };

  const handleRotationChange = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      const updatedRotation = { ...item.rotation!, [name]: value };
      const updatedParams = { ...item, rotation: updatedRotation };
      onItemChange(updatedParams);
    };
  };

  const translationNumberRange = {
    min: -9999999,
    max: 99999999,
    step: 0.1,
  };

  const rotationNumberRange = {
    min: -180,
    max: 180,
    step: 0.1,
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <EditField
          value={item.translation!.x}
          onChange={handleTranslationChange("x")}
          label={"X"}
          name={"x"}
          numberRange={translationNumberRange}
        ></EditField>
        <EditField
          value={item.translation!.y}
          onChange={handleTranslationChange("y")}
          label={"Y"}
          name={"y"}
          numberRange={translationNumberRange}
        ></EditField>
        <div className="flex flex-row">
          <EditField
            value={item.translation!.z}
            onChange={handleTranslationChange("z")}
            label={"Z"}
            name={"z"}
            numberRange={translationNumberRange}
          ></EditField>
          <AlignWithGridfinityButton item={item}></AlignWithGridfinityButton>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <EditField
          className="w-full"
          value={item.rotation!.x}
          onChange={handleRotationChange("x")}
          label={"Rotation X"}
          name={"rotationX"}
          numberRange={rotationNumberRange}
        ></EditField>
        <EditField
          className="w-full"
          value={item.rotation!.y}
          onChange={handleRotationChange("y")}
          label={"Rotation Y"}
          name={"rotationY"}
          numberRange={rotationNumberRange}
        ></EditField>
        <EditField
          className="w-full"
          value={item.rotation!.z}
          onChange={handleRotationChange("z")}
          label={"Rotation Z"}
          name={"rotationZ"}
          numberRange={rotationNumberRange}
        ></EditField>
      </div>
    </>
  );
};

export default TransformEdit;
