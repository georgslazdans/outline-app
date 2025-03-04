import React, { ChangeEvent } from "react";

export type Option = {
  value: string | number;
  label: string;
};

type Props = {
  value?: string | number;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  options: Array<Option>;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectField = ({
  value,
  label,
  name,
  placeholder,
  className,
  options,
  onChange,
}: Props) => {
  return (
    <div className={"flex flex-col " + className ? className : ""}>
      {label && (
        <label className="ml-4" htmlFor={name}>
          {label}
        </label>
      )}
      {/* TODO add custom chevron to select */}
      <select
        className="border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 py-2 pl-6 w-full"
        id={name}
        value={value ? value : ""}
        name={name}
        onChange={(event) => onChange(event)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
