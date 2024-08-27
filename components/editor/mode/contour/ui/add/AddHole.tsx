"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import React from "react";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const icon = "";

const AddHole = ({ dictionary, selectedContour, onContourChanged }: Props) => {
  const onAddHole = () => {
    const emptyContour = {
      points: [
        { x: 5, y: 5 },
        { x: 5, y: -5 },
        { x: -5, y: -5 },
        { x: -5, y: 5 },
      ],
    };
    onContourChanged([...selectedContour, emptyContour]);
  };
  return (
    <ActionButton
      id="add-hole"
      onClick={onAddHole}
      dictionary={dictionary}
      icon={icon}
      label="Hole"
      tooltip="Add Hole"
    ></ActionButton>
  );
};

export default AddHole;
