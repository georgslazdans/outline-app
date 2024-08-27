"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionGroup from "@/components/editor/ui/action/ActionGroup";
import React from "react";
import AddPoint from "./AddPoint";
import AddHole from "./AddHole";
import ContourPoints from "@/lib/data/point/ContourPoints";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const AddButtonGroup = ({
  dictionary,
  selectedContour,
  onContourChanged,
}: Props) => {
  return (
    <>
      <ActionGroup dictionary={dictionary} name={"Add"}>
        <AddPoint
          dictionary={dictionary}
          selectedContour={selectedContour}
          onContourChanged={onContourChanged}
        ></AddPoint>
        <AddHole
          dictionary={dictionary}
          selectedContour={selectedContour}
          onContourChanged={onContourChanged}
        ></AddHole>
      </ActionGroup>
    </>
  );
};

export default AddButtonGroup;
