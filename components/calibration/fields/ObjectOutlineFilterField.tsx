"use client";

import React, { ChangeEvent, useCallback } from "react";
import { useResultContext } from "../ResultContext";

type Props = {
  value: number[];
  label: string;
  name: string;
  className?: string;
  onChange: (value: number[]) => void;
};

const ObjectOutlineFilterField = ({
  value,
  label,
  name,
  className,
  onChange,
}: Props) => {
  const { objectOutlineImages } = useResultContext();

  const createValueIndexes = (): number[] => {
    const indexes: number[] = [];
    objectOutlineImages.forEach((_, index) => indexes.push(index));
    return indexes;
  };
  const handleCheckboxChange = useCallback(
    (index: number) => {
      const indexes =
        !value || value.length == 0 ? createValueIndexes() : value;
      const newValue = indexes.includes(index)
        ? indexes.filter((v) => v !== index)
        : [...value, index];

      if (newValue.length != 0) {
        onChange(newValue.sort((a, b) => (a >= b ? 1 : -1)));
      }
    },
    [value, onChange]
  );

  const isSelected = useCallback(
    (index: number) => {
      return value.length === 0 || value.includes(index);
    },
    [value]
  );

  return (
    <div className={"flex flex-col w-full " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}

      {objectOutlineImages.map((_: ImageData, index: number) => (
        <div key={index} className="flex mb-2 w-full">
          <label className="ml-4 my-auto" htmlFor={`${name}-${index}`}>
            Contour {index + 1}
          </label>
          <input
            type="checkbox"
            id={`${name}-${index}`}
            checked={isSelected(index)}
            onChange={() => handleCheckboxChange(index)}
            className="border-4 rounded-[64px] bg-white dark:bg-black 
          border-black dark:border-white p-1.5 pl-6 mr-6 w-8 h-8 my-auto ml-auto "
          />
        </div>
      ))}
    </div>
  );
};

export default ObjectOutlineFilterField;
