import React, { ChangeEvent, HTMLInputTypeAttribute } from "react";

type Props = {
  value?: string | number;
  label: string;
  name: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  setValue: (val: any) => void;
};

const InputField = ({
  value,
  label,
  name,
  placeholder,
  type,
  setValue,
}: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex flex-col">
      {label && 
      <label className="ml-4 mb-0.5" htmlFor={name}>{label}</label>}
      <input
        className="border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white p-1.5 pl-6 "
        id={name}
        type={type ? type : "text"}
        value={value ? value : ""}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputField;
