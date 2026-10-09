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
        d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 12.5 2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.5 9.5 2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 6.5 2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m17.5 15.5 2-2" />
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
