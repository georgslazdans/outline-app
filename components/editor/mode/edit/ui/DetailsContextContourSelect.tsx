"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Context } from "@/context/DetailsContext";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import SelectField, { Option } from "@/components/fields/SelectField";
import { useContourCacheContext } from "../../../cache/ContourCacheContext";
import ContourPoints, {
  modifyContourList,
} from "@/lib/data/contour/ContourPoints";
import NumberField from "@/components/fields/NumberField";

type Props = {
  dictionary: Dictionary;
  onSelect: (ContourPoints: ContourPoints[], context: Context) => void;
};

const centeredPointsOf = (
  context: Context,
  contourIndex: number
): ContourPoints[] => {
  const paperDimensions = paperDimensionsOfDetailsContext(context);
  if (context.contours && context.contours.length > 0) {
    const index =
      contourIndex >= context.contours.length
        ? context.contours.length - 1
        : contourIndex;
    const outline = context.contours[index];
    const holePoints = outline.holes ? outline.holes : [];
    const contourPoints = [...holePoints, outline.outline];
    const contours =
      modifyContourList(contourPoints).centerPoints(paperDimensions);
    return modifyContourList(contours).mirrorPointsOnXAxis();
  }
  return [];
};

const asOption = (context: Context): Option => {
  return {
    value: context.id!,
    label: context.details.name,
  };
};

const DetailsContextContourSelect = ({ dictionary, onSelect }: Props) => {
  const { items } = useContourCacheContext();
  const [options, setOptions] = useState<Option[]>();
  const [selectedContextId, setSelectedContextId] = useState<number>();
  const [selectedContourIndex, setSelectedContourIndex] = useState<number>(0);

  const refreshData = useCallback(() => {
    if (items && items.length > 0) {
      setOptions(items.map(asOption));
      const item = items[0];
      setSelectedContextId(item.id!);
      onSelect(centeredPointsOf(item, 0), item);
    }
  }, [items, onSelect]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const contextId = Number.parseInt(event.target.value);
    const selected = items?.find((it) => it.id == contextId);
    if (selected) {
      onSelect(centeredPointsOf(selected, 0), selected);
      setSelectedContextId(contextId);
      setSelectedContourIndex(0);
    }
  };

  const onContourIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const contourIndex = Number.parseInt(event.target.value);
    setSelectedContourIndex(contourIndex);
    const selected = items?.find((it) => it.id == selectedContextId);
    if (selected) {
      onSelect(centeredPointsOf(selected, contourIndex), selected);
    }
  };

  const numberOfContours = useCallback(() => {
    if (selectedContextId && items) {
      const item = items?.find((it) => it.id == selectedContextId);
      const contoursSize = item?.contours.length;
      return contoursSize ? contoursSize : 0;
    } else {
      return 0;
    }
  }, [selectedContextId, items]);

  useEffect(() => refreshData(), [refreshData]);

  return (
    <>
      <SelectField
        label={"Select Contour"}
        name={"Select Contour"}
        options={options ? options : []}
        value={selectedContextId}
        onChange={onChange}
      ></SelectField>
      {numberOfContours() > 0 && (
        <div className="flex flex-row">
          <NumberField
            label="Contour Index"
            name="Contour Index"
            className="flex-grow"
            value={selectedContourIndex}
            onChange={onContourIndexChange}
            numberRange={{
              min: 0,
              max: numberOfContours() - 1,
            }}
          ></NumberField>
          <label className="ml-4 mt-9">of {numberOfContours() - 1}</label>
        </div>
      )}
    </>
  );
};

export default DetailsContextContourSelect;
