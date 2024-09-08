"use client";

import React, { ChangeEvent } from "react";
import { useEditorContext } from "../EditorContext";
import InputField from "@/components/fields/InputField";

type Props = {
  value?: string | number;
  label?: string;
  name: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TextEditField = ({
  value,
  label,
  name,
  onChange,
  className,
}: Props) => {
  const { setInputFieldFocused } = useEditorContext();

  const onBlur = () => {
    setInputFieldFocused(false);
  };

  const onFocus = () => {
    setInputFieldFocused(true);
  };

  return (
    <>
      <InputField
        className={className}
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
      ></InputField>
    </>
  );
};

export default TextEditField;
