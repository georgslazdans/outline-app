"use client";

import React, { ChangeEvent } from "react";
import { useEditorContext } from "../EditorContext";
import NumberField, { NumberRange } from "@/components/fields/NumberField";
import { Tooltip } from "react-tooltip";

type Props = {
  value?: string | number;
  label?: string;
  name: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  numberRange?: NumberRange;
  tooltip?: string;
};

const EditField = ({
  value,
  label,
  name,
  onChange,
  className,
  numberRange,
  tooltip,
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
      <NumberField
        className={className}
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        numberRange={numberRange}
        onBlur={onBlur}
        onFocus={onFocus}
      ></NumberField>
      {tooltip && (
        <Tooltip anchorSelect={"#" + name} place="top">
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};

export default EditField;
