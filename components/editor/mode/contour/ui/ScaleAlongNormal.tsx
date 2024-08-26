"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useState } from "react";
import ContourPoints, { modifyContour, queryContourList } from "@/lib/point/ContourPoints";
import ActionGroup from "@/components/editor/ui/action/ActionGroup";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import EditField from "../../EditField";

type Props = {
  dictionary: Dictionary;
  contour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
    />
  </svg>
);

const ScaleAlongNormal = ({ dictionary, contour, onContourChanged }: Props) => {
  const [scale, setScale] = useState(0.1);

  const handleScaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value);
    setScale(value);
  };

  const scaleContour = () => {
    const {findLargestContourOf} = queryContourList(contour);
    const base = findLargestContourOf();
    const scaledContours = contour.map((it) => {
      const { scaleAlongNormal } = modifyContour(it);
      console.log("Is base", it == base, it, base);
      return scaleAlongNormal(it == base ? scale : scale);
    });
    onContourChanged(scaledContours);
  };

  return (
    <>
      <ActionGroup dictionary={dictionary} name={"Scale Along Normal"}>
        <EditField
          className="w-40"
          value={scale}
          label="Distance (mm)"
          onChange={handleScaleChange}
          name={"normal-scale"}
          numberRange={{ min: -9999999, max: 99999999, step: 0.05 }}
        ></EditField>
        <ActionButton
          id="scale-along-normal"
          onClick={scaleContour}
          dictionary={dictionary}
          icon={icon}
          label="Scale"
          tooltip="Scale Contour"
        ></ActionButton>
      </ActionGroup>
    </>
  );
};

export default ScaleAlongNormal;
