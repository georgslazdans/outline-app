"use client";
import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

type NumberRange = {
  min: number;
  max: number;
};

type Props = {
  value?: string | number;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  slider?: boolean;
  numberRange?: NumberRange;
};

const NumberField = ({
  value,
  label,
  name,
  placeholder,
  className,
  onChange,
  autofocus,
  slider = false,
  numberRange = {
    min: 0,
    max: 255,
  },
}: Props) => {
  const sliderSuffix = "-slider";
  const inputClass = slider ? "w-20" : "w-full";

  const removeSuffix = (name: string) => {
    return name.replace(sliderSuffix, "");
  };

  const handleSlider = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.name = removeSuffix(event.target.name);
    onChange(event);
  };

  return (
    <div className={"flex flex-col " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-row">
        {slider && (
          <input
            className="flex-grow ml-2 mr-4"
            type="range"
            id={name + sliderSuffix}
            name={name + sliderSuffix}
            min={numberRange.min}
            max={numberRange.max}
            onChange={(event) => handleSlider(event)}
            value={value ? value : ""}
          />
        )}

        <input
          className={
            `border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white 
          p-1.5 pl-6 w-20 ` + inputClass
          }
          id={name}
          type="number"
          value={value ? value : ""}
          name={name}
          placeholder={placeholder}
          onChange={(event) => onChange(event)}
          autoFocus={autofocus}
        />
      </div>
    </div>
  );
};

export default NumberField;
