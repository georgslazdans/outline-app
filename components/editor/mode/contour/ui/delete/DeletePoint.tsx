"use client";

import { Dictionary } from "@/app/dictionaries";
import Button from "@/components/Button";
import { useEditorContext } from "@/components/editor/EditorContext";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import ContourPoints, { modifyContourList } from "@/lib/point/ContourPoints";
import React from "react";
import { TRASH_CAN_SVG } from "../../../edit/ui/icon/GlobalIcons";

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
      <ActionButton
        dictionary={dictionary}
        id={"delete-selected-point"}
        onClick={onDeletePoint}
        {...useHotkey("Delete")}
        icon={TRASH_CAN_SVG}
        label="Delete"
        tooltip="Delete selected point (Delete)"
        className="text-red"
      ></ActionButton>
    </>
  );
};

export default DeletePoint;
