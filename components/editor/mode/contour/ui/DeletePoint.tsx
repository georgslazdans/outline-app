"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import ContourPoints, { modifyContourList } from "@/lib/point/ContourPoints";
import React from "react";

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

  const onDeletePoint = () => {
    if (selectedContour && selectedPoint) {
      const { deleteContourPoint } = modifyContourList(selectedContour);
      setSelectedPoint(undefined);
      onContourChanged(deleteContourPoint(selectedPoint));
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
