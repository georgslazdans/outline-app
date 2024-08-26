"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import ContourPoints from "@/lib/point/ContourPoints";
import Point from "@/lib/point/Point";
import React from "react";
import ContourIndex from "../ContourIndex";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const DeletePoint = ({
  dictionary,
  selectedContour,
  onContourChanged,
}: Props) => {
  const { selectedPoint, setSelectedPoint, useHotkey } = useEditorContext();

  const removePointFrom = (index: number, points: Point[]): Point[] => {
    return points.filter((_, pointIndex) => pointIndex !== index);
  };

  const removeFrom = (
    index: ContourIndex,
    contour: ContourPoints[]
  ): ContourPoints[] => {
    return contour.map((it, i) => {
      if (i === index.contour) {
        return {
          ...it,
          points: removePointFrom(index.point, it.points),
        };
      }
      return it;
    });
  };

  const onDeletePoint = () => {
    if (selectedContour && selectedPoint) {
      setSelectedPoint(undefined);
      onContourChanged(removeFrom(selectedPoint, selectedContour));
    }
  };

  return (
    <>
      <Button onClick={onDeletePoint} {...useHotkey("Delete")}>
        <label>Delete Point</label>
      </Button>
    </>
  );
};

export default DeletePoint;
