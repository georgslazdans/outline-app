"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import {
  ContourPoints,
  findLargestContourOf,
  scaleAlongNormal,
  scaleAlongNormalNew,
} from "@/lib/Point";
import React, { ChangeEvent, useState } from "react";
import EditField from "../EditField";

type Props = {
  dictionary: Dictionary;
  contour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const ScaleAlongNormal = ({ dictionary, contour, onContourChanged }: Props) => {
  const [scale, setScale] = useState(0.8);

  const handleScaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value);
    setScale(value);
  };

  const scaleContour = () => {
    const base = findLargestContourOf(contour);
    const scaledContours = contour.map((it) => {
      if (it == base) {
        scaleAlongNormalNew(it, -scale);
      }
      return scaleAlongNormalNew(it, scale);
    });
    onContourChanged(scaledContours);
  };

  return (
    <>
      <div className="mx-16">
        <EditField
          value={scale}
          onChange={handleScaleChange}
          label={"Scale Along Normal"}
          name={"normal-scale"}
          numberRange={{ min: -9999999, max: 99999999, step: 0.05 }}
        ></EditField>
        <Button className="mt-2 mb-2" onClick={scaleContour}>
          <label>Scale</label>
        </Button>
      </div>
    </>
  );
};

export default ScaleAlongNormal;
