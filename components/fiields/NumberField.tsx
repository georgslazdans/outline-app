"use client";
import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

type NumberRange = {
  min: number;
  max: number;
  step?: number;
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
    step: 1,
  },
}: Props) => {
  const [debouncedEvent, setDebouncedEvent] =
    useState<ChangeEvent<HTMLInputElement>>();
  const [sliderValue, setSliderValue] = useState<number>(value as number);

  const sliderSuffix = "-slider";
  const inputClass = slider ? "w-20" : "w-full";

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedEvent) {
        onChange(debouncedEvent);
        setDebouncedEvent(undefined);
      }
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedEvent, onChange]);

  const removeSuffix = (name: string) => {
    return name.replace(sliderSuffix, "");
  };

  const handleSlider = (sliderEvent: ChangeEvent<HTMLInputElement>) => {
    sliderEvent.target.name = removeSuffix(sliderEvent.target.name);
    const event = {
      target: {
        name: removeSuffix(name),
        value: sliderEvent.target.value,
      },
    } as ChangeEvent<HTMLInputElement>;
    setDebouncedEvent(event);
    setSliderValue(Number.parseFloat(sliderEvent.target.value));
  };

  const handleInput = (inputEvent: ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number.parseFloat(inputEvent.target.value));
    onChange(inputEvent);
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
            step={numberRange.step}
            onChange={(event) => handleSlider(event)}
            value={sliderValue}
          />
        )}

        <input
          className={
            `border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white 
          p-1.5 pl-6 w-20 ` + inputClass
          }
          id={name}
          type="number"
          value={sliderValue}
          name={name}
          min={numberRange.min}
          max={numberRange.max}
          step={numberRange.step}
          placeholder={placeholder}
          onChange={(event) => handleInput(event)}
          autoFocus={autofocus}
        />
      </div>
    </div>
  );
};

export default NumberField;
