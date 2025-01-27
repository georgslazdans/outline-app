"use client";
import StepName from "@/lib/opencv/processor/steps/StepName";
import { findStep } from "@/lib/opencv/StepResult";
import React, { ChangeEvent, useCallback } from "react";
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

  const getOutlineCount = useCallback(() => {
    if (stepResults) {
      const findPaperOutline = findStep(StepName.FIND_PAPER_OUTLINE).in(
        stepResults
      );
      if (findPaperOutline?.contours) {
        return findPaperOutline.contours.length - 1;
      }
    }
    return 1;
  }, [stepResults]);

  return (
    <div className={"flex flex-col " + className}>
      {label && (
        <label className="ml-4 mb-0.5" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="ml-auto mr-4">
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
        <label> of {getOutlineCount()}</label>
      </div>
    </div>
  );
};

export default OutlineSelectField;
