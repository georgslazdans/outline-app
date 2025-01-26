"use client";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { findStep } from "@/lib/opencv/StepResult";
import React, { ChangeEvent } from "react";
import { useResultContext } from "../ResultContext";

type Props = {
  value?: number;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const OutlineSelectField = ({
  value,
  label,
  name,
  placeholder,
  className,
  onChange,
}: Props) => {
  const { stepResults } = useResultContext();

  const getOutlineCount = () => {
    if (stepResults) {
      const findPaperOutline = findStep(StepName.FIND_PAPER_OUTLINE).in(
        stepResults
      );
      if (findPaperOutline?.contours) {
        return findPaperOutline.contours.length - 1;
      }
    }
    return 0;
  };

  return (
    <div className={"flex flex-row " + className}>
      {label && (
        <label className="ml-4 mb-0.5 w-full" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`border-4 rounded-[64px] bg-white dark:bg-black border-black dark:border-white 
          p-1.5 pl-6 w-20 `}
        id={name}
        type="number"
        value={value}
        name={name}
        min={0}
        max={getOutlineCount()}
        step={1}
        placeholder={placeholder}
        onChange={(event) => onChange(event)}
      />
    </div>
  );
};

export default OutlineSelectField;
