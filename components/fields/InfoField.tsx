"use client";
import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  value?: string | number;
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  padding?: string;
  tooltip?: string;
};

const InfoField = ({ value, label, name, className, tooltip }: Props) => {
  return (
    <div className={"flex flex-col " + className}>
      {label && <label className="ml-4 mb-0.5">{label}</label>}
      <div className="flex flex-row flex-grow">
        <label className="my-auto ml-6" id={name}>
          {value}
        </label>
      </div>
      {tooltip && (
        <Tooltip anchorSelect={"#" + name} place="top">
          {tooltip}
        </Tooltip>
      )}
    </div>
  );
};

export default InfoField;
