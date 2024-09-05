"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionButton from "@/components/editor/ui/action/ActionButton";
import ContourPoints from "@/lib/data/contour/ContourPoints";
import React from "react";
import { HOLE_ICON } from "./Icons";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

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
      icon={HOLE_ICON}
      label="Hole"
      tooltip="Add Hole"
    ></ActionButton>
  );
};

export default AddHole;
