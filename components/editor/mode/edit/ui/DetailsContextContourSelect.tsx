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

type Props = {
  dictionary: Dictionary;
  onSelect: (ContourPoints: ContourPoints[], context: Context) => void;
};

const centeredPointsOf = (context: Context): ContourPoints[] => {
  const paperDimensions = paperDimensionsOfDetailsContext(context);
  if (context.contours && context.contours.length > 0) {
    const contours = modifyContourList(context.contours).centerPoints(
      paperDimensions
    );
    return modifyContourList(contours).mirrorPointsOnXAxis();
  }
  return [];
};

const DetailsContextContourSelect = ({ dictionary, onSelect }: Props) => {
  const { items } = useContourCacheContext();
  const [options, setOptions] = useState<Option[]>();
  const [selected, setSelected] = useState<number>();

  const refreshData = useCallback(() => {
    const asOption = (context: Context): Option => {
      return {
        value: context.id!,
        label: context.details.name,
      };
    };
    if (items && items.length > 0) {
      setOptions(items.map(asOption));
      const item = items[0];
      setSelected(item.id!);
      onSelect(centeredPointsOf(item), item);
    }
  }, [items, onSelect]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const contextId = Number.parseInt(event.target.value);
    const selected = items?.find((it) => it.id == contextId);
    if (selected) {
      onSelect(centeredPointsOf(selected), selected);
      setSelected(contextId);
    }
  };

  useEffect(() => refreshData(), [refreshData]);

  return (
    <>
      <SelectField
        label={"Select Contour"}
        name={"Select Contour"}
        options={options ? options : []}
        value={selected}
        onChange={onChange}
      ></SelectField>
    </>
  );
};

export default DetailsContextContourSelect;
