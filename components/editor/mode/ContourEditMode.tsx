"use client";

import { Dictionary } from "@/app/dictionaries";
import { ModelData, modelWorkOf } from "@/lib/replicad/Work";
import React, { useState } from "react";
import SvgMesh from "../svg/SvgMesh";
import SvgSelect from "../svg/SvgSelect";
import { ContourPoints } from "@/lib/Point";
import { shadowItemOf } from "@/lib/replicad/Model";

type Props = {
  dictionary: Dictionary;
  onContourChange: (data: ModelData) => void;
  setDisableCamera: (disabled: boolean) => void;
};

const ContourEditMode = ({ dictionary, onContourChange, setDisableCamera }: Props) => {
  const [selectedContour, setSelectedContour] = useState<ContourPoints[]>();

    const onContourSelect = (points: ContourPoints[]) => {
        setSelectedContour(points);
        const shadow = shadowItemOf(points);
        // setModelData({ items: [...modelData.items, shadow] });
      };
    
  return (
    <>
         {selectedContour && (
            <SvgMesh
              contoursPoints={selectedContour}
              onPointMoveStart={() => setDisableCamera(true)}
              onPointMoveEnd={() => setDisableCamera(false)}
            ></SvgMesh>
          )}
      <SvgSelect dictionary={dictionary} onSelect={onContourSelect}></SvgSelect>
    </>
  );
};

export default ContourEditMode;
