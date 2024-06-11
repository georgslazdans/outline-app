"use client";
import React, {
  ChangeEvent,
  HTMLInputTypeAttribute,
} from "react";

type Props = {
  value?: string | number;
  label: string;
  name: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  value,
  label,
  name,
  placeholder,
  type,
  className,
  onChange,
}: Props) => {
  const inputWidth = type == "number" ? "w-20 " : "w-full";
  
  return (
    <div className={"flex flex-col " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-row">
        {type == "number" && (
          <input
            className="flex-grow ml-2 mr-4"
            type="range"
            id={name + "-slider"}
            name={name + "-slider"}
            min="0"
            max="255"
            onChange={(event) => onChange(event)}
            value={value ? value : ""}
          />
        )}

        <input
          className={
            `border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white 
          p-1.5 pl-6 ` + inputWidth
          }
          id={name}
          type={type ? type : "text"}
          value={value ? value : ""}
          name={name}
          placeholder={placeholder}
          onChange={(event) => onChange(event)}
        />
      </div>
    </div>
  );
};

export default InputField;
