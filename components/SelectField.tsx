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
  options: Array<Option>;
  setValue: (val: any) => void;
};

const SelectField = ({
  value,
  label,
  name,
  placeholder,
  options,
  setValue,
}: Props) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="ml-4" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        className="border-4 rounded-[64px] border-black dark:border-white p-1.5 pl-6"
        id={name}
        value={value ? value : ""}
        name={name}
        onChange={handleChange}
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
