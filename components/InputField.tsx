import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

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
  return (
    <div className={"flex flex-col " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className="border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 pl-6 "
        id={name}
        type={type ? type : "text"}
        value={value ? value : ""}
        name={name}
        placeholder={placeholder}
        onChange={(event) => onChange(event)}
      />
    </div>
  );
};

export default InputField;
