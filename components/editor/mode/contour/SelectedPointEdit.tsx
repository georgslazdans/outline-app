"use client";

import { Dictionary } from "@/app/dictionaries";
import React, { ChangeEvent, useCallback, useMemo } from "react";
import ContourIndex from "./ContourIndex";
import { ContourPoints } from "@/lib/Point";
import EditField from "../EditField";

type Props = {
  dictionary: Dictionary;
  contourPoints: ContourPoints[];
  selectedPoint: ContourIndex;
  onPointChanged: (points: ContourPoints[]) => void;
};

const SelectedPointEdit = ({
  dictionary,
  contourPoints,
  selectedPoint,
  onPointChanged,
}: Props) => {
  const getSelectedPoint = useCallback(() => {
    const { contour, point } = selectedPoint;
    return contourPoints[contour].points[point];
  }, [selectedPoint, contourPoints]);

  const currentPoint = useMemo(getSelectedPoint, [getSelectedPoint]);

  const handlePointChange = (field: string) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);

      const updatedPoints = [...contourPoints];
      const { contour, point } = selectedPoint;
      updatedPoints[contour].points[point] = {
        ...getSelectedPoint(),
        [field]: value,
      };
      onPointChanged(updatedPoints);
    };
  };

  return (
    <>
      <EditField
        value={currentPoint?.x}
        onChange={handlePointChange("x")}
        label={"X"}
        name={"pointX"}
        numberRange={{ min: -9999999, max: 99999999, step: 0.05 }}
      ></EditField>
      <EditField
        value={currentPoint?.y}
        onChange={handlePointChange("y")}
        label={"Y"}
        name={"pointY"}
        numberRange={{ min: -9999999, max: 99999999, step: 0.05 }}
      ></EditField>
    </>
  );
};

export default SelectedPointEdit;
