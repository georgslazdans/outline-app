"use client";

import { Dictionary } from "@/app/dictionaries";
import CheckboxField from "@/components/fields/CheckboxField";
import GridfinityParams from "@/lib/replicad/model/item/gridfinity/GridfinityParams";
import React, { ChangeEvent, useCallback } from "react";
import EditField from "../../../EditField";
import { useModelDataContext } from "@/components/editor/ModelDataContext";
import { forModelData } from "@/lib/replicad/model/ForModelData";
import Gridfinity, {
  convertGridfinityHeightUnits,
} from "@/lib/replicad/model/item/gridfinity/Gridfinity";
import EditorHistoryType from "@/components/editor/history/EditorHistoryType";
import Item from "@/lib/replicad/model/Item";
import ModelData from "@/lib/replicad/model/ModelData";
import ItemType from "@/lib/replicad/model/ItemType";
import { SplitModification } from "@/lib/replicad/model/item/gridfinity/Modification";
import { reconstructSplitCuts } from "@/lib/replicad/model/item/gridfinity/SplitCut";

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
  const { findAlignedItems } = forModelData(data);
  const previouslyAlignedItems = findAlignedItems(
    convertGridfinityHeightUnits(previousHeight)
  );

  let result = data;
  previouslyAlignedItems.forEach((id) => {
    const { alignWithGridfinity, getById } = forModelData(result);
    const item = getById(id);
    result = alignWithGridfinity(item);
  });
  return result;
};

const updateSplitCuts = (
  data: ModelData,
  newParams: GridfinityParams
): ModelData => {
  const gridfinity = data.items.find(
    (it) => it.type == ItemType.Gridfinity
  ) as Item & Gridfinity;
  const split = gridfinity?.modifications.find(
    (it) => it.type == ItemType.GridfinitySplit
  );
  if (split) {
    const { updateItem } = forModelData(data);
    const newSplit: Item & SplitModification = {
      ...split,
      cuts: reconstructSplitCuts(newParams.xSize, newParams.ySize, split.cuts),
    };
    return updateItem(newSplit);
  } else {
    return data;
  }
};

const handleParamsChange = (
  data: ModelData,
  oldParams: GridfinityParams,
  newParams: GridfinityParams
): ModelData => {
  const previousHeight = oldParams.height;
  let modelData = data;
  if (previousHeight != newParams.height) {
    modelData = updateAlignedItems(data, oldParams, newParams);
  }
  if (
    oldParams.xSize != newParams.xSize ||
    oldParams.ySize != newParams.ySize
  ) {
    modelData = updateSplitCuts(data, newParams);
  }

  return modelData;
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
      updatedData = handleParamsChange(updatedData, params, newParams);
      setModelData(updatedData, EditorHistoryType.OBJ_UPDATED, item.id);
    },
    [item, modelData, params, setModelData]
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
