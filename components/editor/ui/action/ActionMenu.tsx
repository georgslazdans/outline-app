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
            <>
              <h3
                key={index}
                className={"" + selectedClass(it.value)}
                onClick={() => onChange(it.value)}
              >
                {it.label}
              </h3>
              {index != options.length - 1 && (
                <div className="border border-l-black dark:border-l-white"></div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default ActionMenu;
