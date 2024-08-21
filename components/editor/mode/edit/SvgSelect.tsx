"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { Context } from "@/context/DetailsContext";
import { centerPoints, ContourPoints } from "@/lib/Point";
import { paperDimensionsOfDetailsContext } from "@/lib/opencv/PaperSettings";
import SelectField, { Option } from "@/components/fields/SelectField";
import { useContourCacheContext } from "../../cache/ContourCacheContext";

type Props = {
  dictionary: Dictionary;
  onSelect: (ContourPoints: ContourPoints[]) => void;
};

const centeredPointsOf = (context: Context): ContourPoints[] => {
  const paperDimensions = paperDimensionsOfDetailsContext(context);
  return context.contours.map((it) => centerPoints(it, paperDimensions));
};

const SvgSelect = ({ dictionary, onSelect }: Props) => {
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
      setSelected(items[0].id!);
      onSelect(centeredPointsOf(items[0]));
    }
  }, [items, onSelect]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const contextId = Number.parseInt(event.target.value);
    const selected = items?.find((it) => it.id == contextId);
    if (selected) {
      onSelect(centeredPointsOf(selected));
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

export default SvgSelect;
