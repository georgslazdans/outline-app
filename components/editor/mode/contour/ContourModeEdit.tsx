"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData } from "@/lib/replicad/Work";
import React, { useEffect, useState } from "react";
import ContourMesh from "./threejs/ContourMesh";
import { ContourPoints } from "@/lib/Point";
import ContourIndex from "./ContourIndex";

type Props = {
  dictionary: Dictionary;
  modelData: ModelData;
  onModelDataChange: (data: ModelData) => void;
  setDisableCamera: (disabled: boolean) => void;
  selectedId?: string;
  onPointSelect: (point: ContourIndex) => void;
};

const ContourModeEdit = ({
  dictionary,
  modelData,
  selectedId,
  onModelDataChange,
  setDisableCamera,
}: Props) => {
  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();

  useEffect(() => {
    const data = modelData.items.find((it) => it.id == selectedId);
    if (data?.type == "shadow") {
      setSelectedContour(data.points);
    } else {
      throw new Error("Can't edit non shadows objects!");
    }
  }, [modelData, selectedId]);

  return (
    <>
      {selectedContour &&
        selectedContour.map((contour, index) => {
          return (
            <ContourMesh
              key={"ContourMesh" + index}
              contoursPoints={[contour]}
              onPointMoveStart={() => setDisableCamera(true)}
              onPointMoveEnd={() => setDisableCamera(false)}
            ></ContourMesh>
          );
        })}
    </>
  );
};

export default ContourModeEdit;
