"use client";
import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

type Props = {
  value?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxField = ({
  value,
  label,
  name,
  placeholder,
  className,
  onChange,
}: Props) => {
  return (
    <div className={"flex flex-row " + className}>
      {label && (
        <label className="ml-4 mb-0.5 w-full" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className="border-4 rounded-[64px] bg-white dark:bg-black 
          border-black dark:border-white p-1.5 pl-6 mr-6 w-8 h-8 mt-6 "
        id={name}
        type={"checkbox"}
        checked={value}
        name={name}
        placeholder={placeholder}
        onChange={(event) => onChange(event)}
      />
    </div>
  );
};

export default CheckboxField;
