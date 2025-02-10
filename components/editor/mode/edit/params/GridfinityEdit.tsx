"use client";

import { Dictionary } from "@/app/dictionaries";
import CheckboxField from "@/components/fields/CheckboxField";
import GridfinityParams from "@/lib/replicad/model/item/GridfinityParams";
import React, { ChangeEvent, useCallback } from "react";
import EditField from "../../EditField";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import Gridfinity, {
  convertGridfinityHeightUnits,
} from "@/lib/replicad/model/item/Gridfinity";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import ModelData from "@/lib/replicad/model/ModelData";

type Props = {
  dictionary: Dictionary;
  item: Item & Gridfinity;
};

const updateAlignedItems = (
  data: ModelData,
  oldParams: GridfinityParams,
  newParams: GridfinityParams
): ModelData => {
  const previousHeight = oldParams.height;
  if (previousHeight != newParams.height) {
    const { findAlignedItems } = forModelData(data);
    const previouslyAlignedItems = findAlignedItems(
      convertGridfinityHeightUnits(previousHeight)
    );

    let result = data;
    previouslyAlignedItems.forEach((id) => {
      const { alignWithGridfinity, getById, updateItem } = forModelData(result);
      const item = getById(id);
      const newItem = alignWithGridfinity(item);
      result = updateItem(newItem);
    });
    return result;
  } else {
    return data;
  }
};

const GridfinityEdit = ({ dictionary, item }: Props) => {
  const { modelData, setModelData } = useModelDataContext();
  const params = item.params;

  const onParamsChange = useCallback(
    (newParams: GridfinityParams) => {
      const { updateItem } = forModelData(modelData);
      let updatedData = updateItem({
        ...item,
        params: newParams,
      });
      updatedData = updateAlignedItems(updatedData, params, newParams);
      setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, item.id);
    },
    [modelData, setModelData]
  );

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
      <div className="flex flex-row gap-2">
        <EditField
          className="w-full"
          value={params.xSize}
          onChange={handleNumberChange("xSize")}
          label={"X Size"}
          name={"xSize"}
          numberRange={{ min: 1, max: 99999, step: 1 }}
        ></EditField>
        <EditField
          className="w-full"
          value={params.ySize}
          onChange={handleNumberChange("ySize")}
          label={"Y Size"}
          name={"ySize"}
          numberRange={{ min: 1, max: 99999, step: 1 }}
        ></EditField>
      </div>
      <EditField
        value={params.height}
        onChange={handleNumberChange("height")}
        label={"Height"}
        name={"height"}
        numberRange={{ min: 0, max: 99999, step: 1 }}
        tooltip="Standard Gridfinity height units of 7mm. Defines the inside of the bin."
      ></EditField>
      <CheckboxField
        value={params.keepFull}
        onChange={handleCheckboxChange("keepFull")}
        label={"Keep Full"}
        name={"keepFull"}
      ></CheckboxField>
      <CheckboxField
        value={params.includeLip != undefined ? params.includeLip : true}
        onChange={handleCheckboxChange("includeLip")}
        label={"Include Lip"}
        name={"includeLip"}
      ></CheckboxField>
      <EditField
        value={params.wallThickness}
        onChange={handleNumberChange("wallThickness")}
        label={"Wall Thickness"}
        name={"wallThickness"}
        numberRange={{ min: 0.00001, max: 99999, step: 0.01 }}
      ></EditField>
      <CheckboxField
        value={params.withMagnet}
        onChange={handleCheckboxChange("withMagnet")}
        label={"With Magnet"}
        name={"withMagnet"}
      ></CheckboxField>
      {params.withMagnet && (
        <div className="flex flex-row gap-2">
          <EditField
            className="w-full"
            value={params.magnetRadius}
            onChange={handleNumberChange("magnetRadius")}
            label={"Magnet Radius"}
            name={"magnetRadius"}
            numberRange={{ min: 0, max: 99999, step: 0.01 }}
          ></EditField>
          <EditField
            className="w-full"
            value={params.magnetHeight}
            onChange={handleNumberChange("magnetHeight")}
            label={"Magnet Height"}
            name={"magnetHeight"}
            numberRange={{ min: 0, max: 99999, step: 0.01 }}
          ></EditField>
        </div>
      )}
      <CheckboxField
        value={params.withScrew}
        onChange={handleCheckboxChange("withScrew")}
        label={"With Screw"}
        name={"withScrew"}
      ></CheckboxField>
      {params.withScrew && (
        <EditField
          value={params.screwRadius}
          onChange={handleNumberChange("screwRadius")}
          label={"Screw Radius"}
          name={"screwRadius"}
          numberRange={{ min: 0, max: 99999, step: 0.01 }}
        ></EditField>
      )}
      <EditField
        value={params.gridSize}
        onChange={handleNumberChange("gridSize")}
        label={"Grid Size"}
        name={"gridSize"}
        numberRange={{ min: 0, max: 99999, step: 0.01 }}
      ></EditField>
    </>
  );
};

export default GridfinityEdit;
