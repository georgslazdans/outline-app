"use client";

import IconButton from "@/components/IconButton";
import React from "react";
import { Tooltip } from "react-tooltip";

const MEASURE_BUTTON = "measure-button";

type Props = {
  active: boolean;
  onClick: () => void;
  tooltip: string;
};

const MeasureButton = ({ active, onClick, tooltip }: Props) => {
  const ruler = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
      />
    </svg>
  );

  return (
    <>
      <IconButton
        id={MEASURE_BUTTON}
        dataTestId="measure-button"
        className={`px-3 py-3 ${
          active ? "!bg-blue-600 !border-blue-600 !text-white" : ""
        }`}
        onClick={onClick}
        hotkey="m"
      >
        {ruler}
      </IconButton>
      <Tooltip anchorSelect={"#" + MEASURE_BUTTON}>{tooltip}</Tooltip>
    </>
  );
};

export default MeasureButton;
