"use client";

import { Dictionary } from "@/app/dictionaries";
import { useEditorContext } from "@/components/editor/EditorContext";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import ContourIndex from "@/lib/data/contour/ContourIndex";
import ContourPoints, {
  modifyContourList,
  queryContour,
} from "@/lib/data/contour/ContourPoints";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const icon = "";

const AddPoint = ({ dictionary, selectedContour, onContourChanged }: Props) => {
  const { selectedPoint } = useEditorContext();
  const onAddPoint = () => {
    const addPointAfterSelected = (
      selectedPoint: ContourIndex
    ): ContourPoints[] => {
      const { addPoint } = modifyContourList(selectedContour);
      const contourIndex = {
        contour: selectedPoint.contour,
        point: selectedPoint.point + 1,
      };
      const { findMiddleBetweenPoints } = queryContour(
        selectedContour[contourIndex.contour]
      );
      const endPointIndex =
        selectedPoint.point >=
        selectedContour[contourIndex.contour].points.length - 1
          ? 0
          : selectedPoint.point + 1;
      return addPoint(
        contourIndex,
        findMiddleBetweenPoints(selectedPoint.point, endPointIndex)
      );
    };

    if (selectedPoint) {
      onContourChanged(addPointAfterSelected(selectedPoint));
    } else {
      onContourChanged(
        addPointAfterSelected({
          contour: 0,
          point: selectedContour[0].points.length - 1,
        })
      );
    }
  };
  return (
    <ActionButton
      id="add-point"
      onClick={onAddPoint}
      dictionary={dictionary}
      icon={icon}
      label="Point"
      tooltip="Add Point"
    ></ActionButton>
  );
};

export default AddPoint;
