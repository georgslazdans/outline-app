"use client";
import React, { ChangeEvent, FocusEventHandler, HTMLInputTypeAttribute } from "react";

type Props = {
  value?: string | number;
  label?: string;
  name: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  required?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  padding?: string;
};

const InputField = ({
  value,
  label,
  name,
  placeholder,
  type,
  className,
  onChange,
  autofocus,
  required = false,
  onBlur,
  onFocus,
  padding = "p-1.5"
}: Props) => {
  return (
    <div className={"flex flex-col " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-row">
        <input
          className={`border-4 rounded-[64px] bg-white dark:bg-black 
          border-black dark:border-white ${padding} pl-6 w-full`}
          id={name}
          type={type ? type : "text"}
          value={value ? value : ""}
          name={name}
          placeholder={placeholder}
          onChange={(event) => onChange(event)}
          autoFocus={autofocus}
          required={required}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
};

export default InputField;
