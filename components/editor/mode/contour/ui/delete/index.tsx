"use client";

import { Dictionary } from "@/app/dictionaries";
import ActionGroup from "@/components/editor/ui/action/ActionGroup";
import React from "react";
import ContourPoints from "@/lib/data/point/ContourPoints";
import DeletePoint from "./DeletePoint";
import { useEditorContext } from "@/components/editor/EditorContext";

type Props = {
  dictionary: Dictionary;
  selectedContour: ContourPoints[];
  onContourChanged: (contour: ContourPoints[]) => void;
};

const DeleteButtonGroup = ({
  dictionary,
  selectedContour,
  onContourChanged,
}: Props) => {
  const { selectedPoint } = useEditorContext();
  return (
    <>
      {selectedContour && selectedPoint && (
        <ActionGroup dictionary={dictionary} name={"Selected"}>
          <DeletePoint
            dictionary={dictionary}
            selectedContour={selectedContour}
            onContourChanged={onContourChanged}
          ></DeletePoint>
        </ActionGroup>
      )}
    </>
  );
};

export default DeleteButtonGroup;
