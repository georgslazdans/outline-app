"use client";

import React from "react";

type Props = {
  options: { value: any; label: string }[];
  onChange: (value: any) => void;
  selected?: any;
};

const ActionMenu = ({ options, onChange, selected }: Props) => {
  const selectedClass = (value: any) => {
    if (value == selected) {
      return "";
    } else {
      return "text-gray";
    }
  };
  return (
    <>
      <div className="w-full flex flex-row justify-between mb-2 px-4">
        {options.map((it, index) => {
          return (
            <div key={index}>
              <h3
                className={"" + selectedClass(it.value)}
                onClick={() => onChange(it.value)}
              >
                {it.label}
              </h3>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ActionMenu;
