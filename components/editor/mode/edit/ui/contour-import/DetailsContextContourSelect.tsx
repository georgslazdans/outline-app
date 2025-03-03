"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Context } from "@/context/DetailsContext";
import SelectField, { Option } from "@/components/fields/SelectField";
import { useContourCacheContext } from "../../../../cache/ContourCacheContext";
import NumberField from "@/components/fields/NumberField";

type Props = {
  dictionary: Dictionary;
  onSelect: (context: Context, contourIndex: number) => void;
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
      onSelect(item, 0);
    }
  }, [items, onSelect]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const contextId = Number.parseInt(event.target.value);
    const selected = items?.find((it) => it.id == contextId);
    if (selected) {
      onSelect(selected, 0);
      setSelectedContextId(contextId);
      setSelectedContourIndex(0);
    }
  };

  const onContourIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const contourIndex = Number.parseInt(event.target.value);
    if (contourIndex != undefined || contourIndex != null) {
      setSelectedContourIndex(contourIndex);
      const selected = items?.find((it) => it.id == selectedContextId);
      if (selected) {
        onSelect(selected, contourIndex);
      }
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
